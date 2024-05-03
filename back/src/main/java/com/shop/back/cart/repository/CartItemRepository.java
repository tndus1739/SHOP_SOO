package com.shop.back.cart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shop.back.cart.dto.CartDetailDto;
import com.shop.back.cart.entity.CartItem;

public interface CartItemRepository extends JpaRepository <CartItem, Long> {

	CartItem findByCartIdAndItemId(Long cartId, Long itemId);

	

	 @Query("SELECT new com.shop.back.cart.dto.CartDetailDto(ci.id, i.name, i.total, ci.count, fi.path) " +
	 
			 "from CartItem ci " +   
			 "join ci.item i " +                             // CartItem과 Item을 조인
			 "join i.ItemGroup ig " +                        // Item과 ItemGroup을 조인
			 "join ig.images fi " +                          // ItemGroup과 File_item을 조인
			 "where ci.cart.id = :cartId " +                 // 특정 Cart ID를 기준으로
			 "and fi.isMain = 1 " +                          // 대표 이미지일 때
			 "order by ci.regDate desc"              		 // 등록 날짜 기준 내림차순 정렬
			 
			
			 )
	List<CartDetailDto> findCartDetailDtoList(@Param("cartId") Long cartId);
	
}
