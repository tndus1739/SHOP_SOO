package com.shop.back.payment.kakaopay;

import lombok.Data;

import java.util.Date;

@Data
public class KakaoPayReadyVO {

	//response
	private String tid, next_redirect_pc_url;
	private Date created_at;
	private String item_name;
	private int price;

}