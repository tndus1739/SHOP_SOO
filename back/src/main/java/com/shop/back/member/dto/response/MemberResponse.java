package com.shop.back.member.dto.response;

import com.shop.back.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String name;
    private String nickname;
    private String email;
    private String pwd;
    private Role role;
    private String gender;
    private LocalDateTime birth;
    private String phone;
    private String address;

}
