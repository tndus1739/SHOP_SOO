package com.shop.back.cart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.shop.back.Role;
import com.shop.back.cart.dto.CartDetailDto;
import com.shop.back.cart.dto.CartItemDto;
import com.shop.back.cart.service.CartService;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.item.service.ItemService;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor

public class CartController {

	
	private final CartService cartService;
	private final MemberRepository memberRepository;

	//  장바구니 추가
	@PostMapping("/cart")

		 public ResponseEntity<?> addCart(@RequestBody List<CartItemDto> cartItems ) {
		        List<Long> cartItemIds = new ArrayList<>();
		        
		        for ( int i = 0 ; i < cartItems.size(); i++ ) {
		        	System.out.println("=================================");
		        	System.out.println(i + "번째 내용 출력 ");
		        	System.out.println("매핑 처리: " + cartItems.get(i).getEmail()); 
		        	System.out.println("매핑 처리: " + cartItems.get(i).getItemId()); 
		        	System.out.println("매핑 처리: " + cartItems.get(i).getCount()); 
		        
		        }
		        
		        for (CartItemDto cartItemDto : cartItems) {
		            try {
		            	
		            	System.out.println(cartItemDto.getCount());
		            	System.out.println(cartItemDto.getEmail());
		            	System.out.println(cartItemDto.getItemId());
		            	
		            	Member member = memberRepository.findByEmail(cartItemDto.getEmail());
		            	
		            	System.out.println("=============");
		            	System.out.println(member.getEmail());
		            	
		            	
		                if (member == null || !member.getEmail().equals(cartItemDto.getEmail())) {
		                    return new ResponseEntity<String>("이메일이 유효하지 않습니다: " + cartItemDto.getEmail(), HttpStatus.BAD_REQUEST);
		                }
		                
		             
		                Long cartItemId = cartService.addCart(cartItemDto, cartItemDto.getEmail());
		                
		                cartItemIds.add(cartItemId);
		                
		                
		            } catch (Exception e) {
		                return new ResponseEntity<String>("처리 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		            }
		        }
		        return new ResponseEntity<List<Long>>(cartItemIds, HttpStatus.OK);
		    }


	
	// 장바구니 조회 
	
	@GetMapping("/cart/{email}")
    public ResponseEntity<List<CartDetailDto>> getCartList(@PathVariable Long id) {
        List<CartDetailDto> cartDetailList = cartService.getCartList(id);
        return new ResponseEntity<>(cartDetailList, HttpStatus.OK);
	}


   // 장바구니 수정
   @PutMapping("cartItem/{cartItemId}")
   public @ResponseBody ResponseEntity updateCartItem(@PathVariable("cartItemId") Long cartItemId, int count){

       if(count <= 0){
           return new ResponseEntity<String>("최소 1개 이상 담아주세요", HttpStatus.BAD_REQUEST);
       } 
          
       

       cartService.updateCartItemCount(cartItemId, count);
       return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
   }
   
   // 장바구니 상품 삭제
   @DeleteMapping("cart/cartItem/{cartItemId}")
   public @ResponseBody ResponseEntity deleteCartItem(@PathVariable("cartItemId") Long cartItemId){


       cartService.deleteCartItem(cartItemId);

       return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
   }

   
   // 주문한 상품 장바구니에서 제외
   
	
}
