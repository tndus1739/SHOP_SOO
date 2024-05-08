package com.shop.back.member.controller;

import com.shop.back.jwt.JwtTokenUtil;
import com.shop.back.member.dto.request.AdminMemberUpdateRequest;
import com.shop.back.member.dto.request.MemberUpdateRequest;
import com.shop.back.member.dto.request.JoinRequest;
import com.shop.back.member.dto.request.LoginRequest;
import com.shop.back.member.dto.response.JoinResponse;
import com.shop.back.member.dto.response.LoginResponse;
import com.shop.back.member.dto.response.MemberResponse;
import com.shop.back.member.entity.Member;
import com.shop.back.member.exception.MemberException;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class MemberController {

    private final MemberService service;
    private final MemberRepository memberRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public MemberController(MemberService service, MemberRepository memberRepository, JwtTokenUtil jwtTokenUtil, BCryptPasswordEncoder passwordEncoder) {
        this.service = service;
        this.memberRepository = memberRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping
    @Operation (summary = "checkEmailDuplicate() : 이메일 중복 체크 API")
    public ResponseEntity<?> checkEmailDuplicate(@RequestParam("email") String email) {
        System.out.println("이메일 중복 요청 성공: " + email);
        System.out.println("MemberController checkEmailDuplicate " + new Date());

        HttpStatus status = service.checkEmailDuplicate(email);
        return new ResponseEntity<>(status);
    }

    //회원가입
    @PostMapping("/join")
    @Operation (summary = "join() : 회원가입 API")
    public ResponseEntity<JoinResponse> join(@Valid @RequestBody JoinRequest req) {
        System.out.println("MemberController join " + new Date());

        return ResponseEntity.ok(service.join(req));
    }

    //로그인
    @PostMapping("/login")
    @Operation (summary = "login() : 회원 로그인 API")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        System.out.println("MemberController login " + new Date());

        return ResponseEntity.ok(service.login(req, response));
    }

    //로그아웃
    @PostMapping("/logout")
    @Operation (summary = "logout() : 로그아웃 API")
    public void logout(HttpServletResponse response) {
        // refreshToken 쿠키를 만료시킵니다.
        jwtTokenUtil.expireCookie(response, "refreshToken");
    }

    //마이페이지 회원 조회
    @GetMapping("/mypage/{id}")
    @Operation (summary = "getMemberInfo() : 회원정보를 조회하는 API")
    public ResponseEntity<MemberResponse> getMemberInfo(@RequestHeader("Authorization") String token) {
        //JWT 토큰에서 사용자 이메일 추출
        String memberEmail = jwtTokenUtil.getUsernameFromToken(token);
        System.out.println("token: " + token);

        // 서비스를 통해 회원 정보 조회
        MemberResponse memberInfo = service.getMemberEmail(memberEmail);
        System.out.println("email: " + memberEmail);

        // 조회된 회원 정보가 없는 경우를 위한 예외 처리는 서비스 내부에서 처리
        return new ResponseEntity<>(memberInfo, HttpStatus.OK);
    }


    //비밀번호 일치 확인
    @PostMapping("/checkPwd")
    @Operation (summary = "checkPassword() : 회원 비밀번호를 확인하는 API")
    public ResponseEntity<String> checkPassword(@RequestBody Map<String, String> requestBody, @RequestHeader("Authorization") String token) {
        try {
            //JWT 토큰에서 사용자 이메일 추출
            String memberEmail = jwtTokenUtil.getUsernameFromToken(token);
            String insertPwd = requestBody.get("insertPwd");
            System.out.println("입력된 비밀번호: " + insertPwd);
            

            //사용자의 존재 여부 확인
            Member member = memberRepository.findByEmail(memberEmail);
            System.out.println("기존 비밀번호: " + member.getPwd() );
            if (member == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            //기존 비밀번호 확인
            if (!passwordEncoder.matches(insertPwd, member.getPwd())) {

                return new ResponseEntity<>("기존 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
            }

            //비밀번호 일치
            return new ResponseEntity<>("비밀번호가 일치합니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("서버 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //정보 수정
    @PutMapping("/mypage/update/{email}")
    @Operation (summary = "updateMember() : 회원정보를 수정하는 API")
    public ResponseEntity<String> updateMember(@PathVariable String email, @RequestBody MemberUpdateRequest req, @RequestHeader("Authorization") String token) {
        System.out.println(email);
        System.out.println(req.getBirth());
        System.out.println(req.getNickname());
        System.out.println(req.getPwd());
        System.out.println(req.getPhone());
        System.out.println(req.getAddress());

        System.out.println("토큰 출력 : "  + token);

        // 클라이언트 요청의 유효성 검증
        ResponseEntity<String> validationResponse = validateRequest(req);
        if (validationResponse != null) {
            return validationResponse;
        }

        // JWT 토큰에서 사용자 이메일 추출
        String memberEmail = jwtTokenUtil.getUsernameFromToken(token);

        // 사용자의 존재 여부 확인
        Member member = memberRepository.findByEmail(memberEmail);
        if (member == null) {
            return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }

        // 정보 수정 권한 확인
        if (!member.getEmail().equals(email)) {
            return new ResponseEntity<>("해당 사용자의 정보를 수정할 수 있는 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }

        // 수정된 비밀번호를 BCrypt 알고리즘을 사용하여 해싱
        String hashedPassword = member.getPwd(); // 기존 비밀번호로 초기화

        // 비밀번호가 수정되었는지 확인 후 암호화
        if (!req.getPwd().equals(member.getPwd())) {
            hashedPassword = passwordEncoder.encode(req.getPwd()); // 새로운 비밀번호로 암호화
        }

        // 회원 정보 수정
        boolean update = service.updateMember(email, req.getNickname(), hashedPassword, req.getBirth(), req.getPhone(), req.getAddress());
        System.out.println("수정된 비밀번호:" + hashedPassword);
        if (update) {
            return new ResponseEntity<>("정보 수정이 완료되었습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("정보 수정을 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //클라이언트 요청의 유효성을 검증하는 메서드
    private ResponseEntity<String> validateRequest(MemberUpdateRequest req) {
        // 닉네임, 비밀번호, 생년월일 중 적어도 하나가 변경되어야 합니다.
        if (req.getNickname() == null && req.getPwd() == null && req.getBirth() == null) {
            return new ResponseEntity<>("변경할 필드가 전송되지 않았습니다.", HttpStatus.BAD_REQUEST);
        }

        // 모든 검증을 통과했다면 null을 반환하여 요청이 유효함을 나타냄
        return null;
    }

    //회원 탈퇴 (Role: UNREGISTER으로 변경)
    @PatchMapping("/mypage/withdraw/{email}")
    @Operation (summary = "withdrawMember() : 회원탈퇴 API")
    public ResponseEntity<String> withdrawMember(@PathVariable String email) {
        try {
            // 회원 탈퇴 처리 수행
            if (service.withdrawMember(email)) {
                return ResponseEntity.ok("회원 탈퇴가 완료되었습니다");
            } else {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("서버 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //탈퇴 검증
    public ResponseEntity<String> validateWithdrawRequest(String memberEmail, String requestEmail) {

        System.out.println("requestEmail: " + requestEmail);

        if (!memberEmail.equals(requestEmail)) {
            return new ResponseEntity<>("탈퇴할 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }
        return null;
    }

    //요청 DTO 검증 예외처리 핸들러
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        System.out.println("MemberController handleMethodArgumentNotValidException " + new Date());

        BindingResult bs = e.getBindingResult();
        StringBuilder sb = new StringBuilder();
        bs.getFieldErrors().forEach(err -> {
            sb.append(String.format("[%s]: %s.\n입력된 값: %s",
                    err.getField(), err.getDefaultMessage(), err.getRejectedValue()));
        });

        return new ResponseEntity<>(sb.toString(), HttpStatus.BAD_REQUEST);

    }

    //사용자 관련 요청 예외처리 핸들러
    @ExceptionHandler(MemberException.class)
    public ResponseEntity<?> handleUserException(MemberException e) {
        System.out.println("UserController handlerUserException " + new Date());

        return new ResponseEntity<>(e.getMessage(), e.getStatus());
    }
}
