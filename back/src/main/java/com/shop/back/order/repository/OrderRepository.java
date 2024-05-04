package com.shop.back.order.repository;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.back.order.entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

//	List<Orders> findOrders( String email, Pageable pageable);
//	
//	Long countOrder(String email);
//	
//   
}
