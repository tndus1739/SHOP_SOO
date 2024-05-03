package com.shop.back.member.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MemberUpdateRequest {

    private String nickname;
    private String pwd;
    private LocalDateTime birth;
    private String phone;
    private String address;
}
