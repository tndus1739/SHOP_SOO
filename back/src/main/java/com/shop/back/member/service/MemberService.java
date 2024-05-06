package com.shop.back.member.service;

import com.shop.back.Role;
import com.shop.back.jwt.JwtAuthenticationFilter;
import com.shop.back.jwt.JwtTokenUtil;
import com.shop.back.member.dto.request.AdminMemberUpdateRequest;
import com.shop.back.member.dto.request.JoinRequest;
import com.shop.back.member.dto.request.LoginRequest;
import com.shop.back.member.dto.response.JoinResponse;
import com.shop.back.member.dto.response.LoginResponse;
import com.shop.back.member.dto.response.MemberResponse;
import com.shop.back.member.entity.Member;
import com.shop.back.member.exception.MemberException;
import com.shop.back.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;



    public HttpStatus checkEmailDuplicate(String email) {
        isExistMemberEmail(email);
        return HttpStatus.OK;
    }

    @Transactional
    public JoinResponse join(JoinRequest req) {

        saveMember(req);
        authenticate(req.getEmail(), req.getPwd());

        return new JoinResponse(req.getEmail());
    }

    private void saveMember(JoinRequest req) {

        //  생년월일 String -> LocalDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate localDate = LocalDate.parse(req.getBirthString(), formatter);

        LocalDateTime localDateTime = localDate.atTime(LocalTime.MIDNIGHT);
        req.setBirth(localDateTime);

        //이메일(아이디) 중복 확인
        isExistMemberEmail(req.getEmail());

        //패스워드 일치 확인
        checkPwd(req.getPwd(), req.getCheckPwd());

        //회원 정보 생성
        String encodePassword = encoder.encode(req.getPwd());
//        CreateMemberParam param = new CreateMemberParam(req, encodePassword);
        Member mb = new Member();
        mb.CreateMemberParam(req, encodePassword);

        Member result = memberRepository.save(mb);
        if (result.getId() == null) {
            throw new MemberException("회원 등록을 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public LoginResponse login(LoginRequest req, HttpServletResponse response) {
        Member member = memberRepository.findByEmail(req.getEmail());
        if (member.getRole() == Role.UNREGISTER) {
            throw new MemberException("탈퇴한 사용자입니다.", HttpStatus.FORBIDDEN);
        }

        authenticate(req.getEmail(), req.getPwd());

        final UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        final String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
        final String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails, response); // 수정된 부분

        System.out.println("Access Token: " + accessToken);
        System.out.println("Refresh Token: " + refreshToken);
        System.out.println("Email: " + req.getEmail());

        return new LoginResponse(accessToken, refreshToken, req.getEmail());
    }

    private void authenticate(String email, String pwd) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, pwd));
        } catch (DisabledException e) {
            throw new MemberException("인증되지 않은 이메일입니다.", HttpStatus.BAD_REQUEST);
        } catch (BadCredentialsException e) {
            throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
    }


    private void isExistMemberEmail(String email) {
        int result = 0;
//        Integer result = memberRepository.isExistMemberEmail(email);
        if (result == 1) {
            throw new MemberException("이미 사용 중인 이메일입니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //회원가입 시 비밀번호 일치 확인
    private void checkPwd(String pwd, String checkPwd) {
        if (!pwd.equals(checkPwd)) {
            throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    // 정보수정/탈퇴 - DB에 저장된 비밀번호 일치 확인
    public boolean checkPassword(Long id, String pwd) {
        Member member = memberRepository.findById(id).orElseThrow(() ->
                new MemberException("회원을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

        return encoder.matches(pwd, member.getPwd());
    }

    //정보 수정
    public boolean updateMember (String email, String nickname, String pwd, LocalDateTime birth, String phone, String address) {
        Member member = memberRepository.findByEmail(email);

        if (member != null) {
            if (nickname != null) {
                member.setNickname(nickname);
            }
            if (pwd != null) {
                member.setPwd(pwd);
            }
            if (birth != null) {
                member.setBirth(birth);
            }
            if (phone != null) {
                member.setPhone(phone);
            }
            if (address != null) {
                member.setAddress(address);
            }

            // 회원 정보를 저장하여 업데이트
            memberRepository.save(member);
            return true;
        } else {
            // 회원이 존재하지 않는 경우 false 반환
            return false;
        }
    }

    public MemberResponse getMemberById(Long id) {
        Member member = memberRepository.findById(id).orElse(null);
        if (member != null) {
            return new MemberResponse(
                    member.getId(),
                    member.getName(),
                    member.getNickname(),
                    member.getEmail(),
                    member.getPwd(),
                    member.getRole(),
                    member.getGender(),
                    member.getBirth(),
                    member.getPhone(),
                    member.getAddress()
            );
        } else {
            return null; // or throw exception
        }
    }

    //마이페이지 회원 조회
    public MemberResponse getMemberEmail(String eamil) {
        Member member = memberRepository.findByEmail(eamil);
        if (member == null) {
            //회원 정보가 없을 경우 예외 처리
            throw new RuntimeException("회원을 찾을 수 없습니다.");
        }

        //조회된 회원 정보 반환
        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getNickname(),
                member.getEmail(),
                member.getPwd(),
                member.getRole(),
                member.getGender(),
                member.getBirth(),
                member.getPhone(),
                member.getAddress()

        );
    }

    public MemberResponse getMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        if (member != null) {
            return new MemberResponse(
                    member.getId(),
                    member.getName(),
                    member.getNickname(),
                    member.getEmail(),
                    member.getPwd(),
                    member.getRole(),
                    member.getGender(),
                    member.getBirth(),
                    member.getPhone(),
                    member.getAddress()
            );
        } else {
            return null; // or throw exception
        }
    }


    //회원 탈퇴 (Role: UNREGISTER으로 변경)
    public boolean withdrawMember(String email) {
        //회원 정보 조회
        Member member = memberRepository.findByEmail(email);
        if (member != null) {
            member.setRole(Role.UNREGISTER);
            memberRepository.save(member);
            return true;
        } else {
            return false;
        }
    }



    //Member Role 조회
    public List<Member> getMemberbyRole(Role role) {
        return memberRepository.findByRole(role);
    }

    // 관리자 페이지 검색
    public List<Member> getMemberListBySearchOption(Role role, String searchType, String keyword) {
        List<Member> memberList;
        if (searchType.equals("name")) {
            memberList = memberRepository.findByRoleAndNameContaining(role, keyword);
            System.out.println("이름으로 검색: " + keyword + memberList);
        } else if (searchType.equals("nickname")) {
            memberList = memberRepository.findByRoleAndNicknameContaining(role, keyword);
            System.out.println("닉네임으로 검색: " + keyword + memberList);
        } else if (searchType.equals("email")) {
            memberList = memberRepository.findByRoleAndEmailContaining(role, keyword);
            System.out.println("이메일으로 검색: " + keyword + memberList);
        } else if (searchType.equals("phone")) {
            memberList = memberRepository.findByRoleAndPhoneContaining(role, keyword);
            System.out.println("전화번호로 검색: " + keyword + memberList);
        } else {
            memberList = memberRepository.findByRole(role);
        }
        return memberList;
    }


}


