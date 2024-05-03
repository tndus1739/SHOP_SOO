package com.shop.back.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemDto {
	
	 @NotBlank(message = "상품 아이디는 필수 입력 값 입니다.")
	    private Long itemId;

	    @Min(value = 1, message = "최소 1개 이상 담아주세요")
	    private int count;

		private String email;
}
