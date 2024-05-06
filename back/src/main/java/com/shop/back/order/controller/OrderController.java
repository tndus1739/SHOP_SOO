package com.shop.back.order.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.shop.back.cart.dto.CartDetailDto;
import com.shop.back.cart.dto.CartOrderDto;
import com.shop.back.cart.service.CartService;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.order.dto.OrderDto;
import com.shop.back.order.dto.OrderHistoryDto;
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
		 	
		 if (member == null) {
		        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다: " + cartOrderDto.getEmail());
		    }
	        if(cartOrderDtoList == null || cartOrderDtoList.size() == 0){
	        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("상품을 를 찾을 수 없습니다 " + cartOrderDto.getEmail());
	        }

	       try {
	    	   Long orderId = cartService.orderCartItem(cartOrderDtoList, member.getEmail());
		        return new ResponseEntity<Long>(orderId, HttpStatus.OK);
	       } catch (Exception e) {
	    	   	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주문 처리 중 오류가 발생했습니다.");
	       }
	        
	    }
	
	
	// 상품상세페이지에서 바로 주문
	@PostMapping("/order")
	public ResponseEntity<?> orderItem (@RequestBody OrderDto orderDto){

       
        Member member = memberRepository.findByEmail(orderDto.getEmail());
        
        if (member == null) {
            return new ResponseEntity<>("회원 정보를 찾을 수 없습니다: " + orderDto.getEmail(), HttpStatus.NOT_FOUND);
            
        }
        
        Long orderId;

        try {
        	
           orderId = orderService.order(orderDto, orderDto.getEmail());
          
        } catch(Exception e){
        	
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

       
		return new ResponseEntity<Long>(orderId, HttpStatus.OK);
    }

	// 주문내역 조회 
	
		@GetMapping("/order/{email}")
	    public ResponseEntity<List<OrderHistoryDto>> getOrderHistory (@RequestParam (name = "email") String email) {
	        List<OrderHistoryDto> orderHistoryList = orderService.getOrderList(email);
	        if (orderHistoryList.isEmpty()) {
	            return ResponseEntity.noContent().build();
	        }
	        return new ResponseEntity<>(orderHistoryList, HttpStatus.OK);
		}
		
		
		
	// 주문 취소
		
		 @DeleteMapping("order/{orderId}")
		   public  ResponseEntity cancelOrder (@PathVariable("orderId") Long orderId){

			 orderService.cancelOrder(orderId);

		       return new ResponseEntity<Long>(orderId, HttpStatus.OK);
		   }
	
}
