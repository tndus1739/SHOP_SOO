package com.shop.back.cart.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shop.back.cart.dto.CartDetailDto;
import com.shop.back.cart.dto.CartItemDto;
import com.shop.back.cart.dto.CartOrderDto;
import com.shop.back.cart.entity.Cart;
import com.shop.back.cart.entity.CartItem;
import com.shop.back.cart.repository.CartItemRepository;
import com.shop.back.cart.repository.CartRepository;
import com.shop.back.item.entity.Item;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.order.dto.OrderDto;
import com.shop.back.order.service.OrderService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

	private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderService orderService;
    
    
    // 장바구니 추가

    public Long addCart (CartItemDto cartItemDto, String email) {

    	Item item = itemRepository.findById(cartItemDto.getItemId()).orElseThrow(EntityNotFoundException::new);

    	Member member = memberRepository.findByEmail(cartItemDto.getEmail());
    	System.out.println("Member 객체 : " + member.getEmail());
    	
    	Cart cart = cartRepository.findByMemberId(member.getId());

    	
    	
    	
    	if (cart == null) {
    		cart = Cart.createCart(member);
    		
    		System.out.println("서비스 1차 검증");
    		cartRepository.save(cart);
    		System.out.println("서비스 2차 검증");
    		
    	}


	 // 기존에 등록하는 제품이 cartItem 테이블에 존재하는지 확인

	CartItem savedCartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), item.getId());


    if(savedCartItem != null){   // 제품이 장바구니에 존재하면 개수만 증가

        savedCartItem.addCount(cartItemDto.getCount());
        return savedCartItem.getId();
    } else {		// 기존에 제품이 장바구니에 존재하지 않으면 전체를 update
        CartItem cartItem = CartItem.createCartItem(cart, item, cartItemDto.getCount());
        cartItemRepository.save(cartItem);
        return cartItem.getId();
    }
}

    // 장바구니 조회

	public List<CartDetailDto> getCartList(String email){

        List<CartDetailDto> cartDetailDtoList = new ArrayList<>();

        Member member = memberRepository.findByEmail(email);
        
        // 회원이 없는 경우 빈 리스트 반환
        if (member == null) {
            return cartDetailDtoList;
        }
        
        Cart cart = cartRepository.findByMemberId(member.getId());
        
        if(cart == null){
            return cartDetailDtoList;
        }
        cartDetailDtoList = cartItemRepository.findCartDetailDtoList(cart.getId());
        return cartDetailDtoList;
	}
	
	// 장바구니 수정
	
	 public void updateCartItemCount(Long cartItemId, int count){
	        CartItem cartItem = cartItemRepository.findById(cartItemId)
	                .orElseThrow(EntityNotFoundException::new);
			cartItem.setCount(count);
			cartItemRepository.save(cartItem);
//	        cartItem.addCount(count);
	    }
	
	// 장바구니 삭제 
	 
	 public void deleteCartItem(Long cartItemId) {
	        CartItem cartItem = cartItemRepository.findById(cartItemId)
	                .orElseThrow(EntityNotFoundException::new);
//	        cartItem.setDel(0);  // 삭제 : 0
//	        cartItemRepository.save(cartItem);
		    cartItemRepository.delete(cartItem);
	 }
	 
	// 주문한 상품 장바구니에서 제거 
	 
	 @Transactional
	 public Long orderCartItem(List<CartOrderDto> cartOrderDtoList, String email){
	    	
	    	
	        List<OrderDto> orderDtoList = new ArrayList<>();

	            
	     
	        for (CartOrderDto cartOrderDto : cartOrderDtoList) {
	            CartItem cartItem = cartItemRepository
	                            .findById(cartOrderDto.getCartItemId())
	                            .orElseThrow(EntityNotFoundException::new);

	            //장바구니 아이템 테이블의 정보를 끄집어 내서 order 테이블에 저장하기위해서 
	            // orderDto 제품번호, 주문한 갯수 정보만 넣어서 orderDtoList에 저장 
	            OrderDto orderDto = new OrderDto();
	            orderDto.setItemId(cartItem.getItem().getId());
	            orderDto.setCount(cartItem.getCount());
	            
	            orderDtoList.add(orderDto);
	        }

	        
	        //cert_item 테이블의 값을 order, order_item에 값을 Insert 
	        Long orderId = orderService.saveOrder(orderDtoList, email);
	        
	        // cert_item 테이블의 선택된 itemId의 대해서 제거 
	        for (CartOrderDto cartOrderDto : cartOrderDtoList) {
	            CartItem cartItem = cartItemRepository
	                            .findById(cartOrderDto.getCartItemId())
	                            .orElseThrow(EntityNotFoundException::new);
	            cartItemRepository.delete(cartItem);
	        }

	        return orderId;
	    }
	 
}
