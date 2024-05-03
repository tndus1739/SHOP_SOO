package com.shop.back.payment.kakaopay;

import lombok.Data;

@Data
public class KakaoReqDto {
	private Long itemId;
	private int cnt;
	private String email;
}
