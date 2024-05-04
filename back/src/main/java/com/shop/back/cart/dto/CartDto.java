package com.shop.back.cart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartDto {

	private Long id;
    private int cnt;
    private Long itemId;
    private Long email;
	
}
