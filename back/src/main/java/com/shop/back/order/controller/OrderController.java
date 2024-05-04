package com.shop.back.order.controller;

import java.awt.print.Pageable;
import java.util.List;

import org.hibernate.query.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.shop.back.cart.dto.CartOrderDto;
import com.shop.back.cart.service.CartService;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.order.dto.OrderDto;
import com.shop.back.order.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OrderController {

	private final CartService cartService;
	private final OrderService orderService;
	private final MemberRepository memberRepository;
	
	// 장바구니 상품 주문
	@PostMapping("/cart/order")
	
	 public  ResponseEntity orderedCartItem(@RequestBody CartOrderDto cartOrderDto){
		
		   
		 List<CartOrderDto> cartOrderDtoList = cartOrderDto.getCartOrderDtoList();
		 
		 for ( int i = 0 ; i < cartOrderDtoList.size() ; i++) {
	        	CartOrderDto cartOrderDto1 = cartOrderDtoList.get(i); 
	        	
	        	System.out.println("==============="+cartOrderDto1.getCartItemId());
	        	
	        }        
		 
		 Member member =  memberRepository.findByEmail(cartOrderDto.getEmail());
		 	
	        if(cartOrderDtoList == null || cartOrderDtoList.size() == 0){
	            return new ResponseEntity<String>("주문할 상품을 선택해주세요", HttpStatus.FORBIDDEN);
	        }


	        Long orderId = cartService.orderCartItem(cartOrderDtoList, member.getEmail());
	        return new ResponseEntity<Long>(orderId, HttpStatus.OK);
	    }
	
	
	// 상품 주문
	@PostMapping("/order")
	public ResponseEntity orderItem (@RequestBody OrderDto orderDto){

       
        Member member = memberRepository.findByEmail(orderDto.getEmail());
        Long orderId;

        try {
        	
           orderId = orderService.order(orderDto, orderDto.getEmail());
          
        } catch(Exception e){
        	
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

       
		return new ResponseEntity<Long>(orderId, HttpStatus.OK);
    }

	
	
}
