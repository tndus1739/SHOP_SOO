package com.shop.back.order.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.back.order.entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

	// 회원의 주문 목록 조회
	List<Orders> findByMemberEmail(String email);
	
   
}
