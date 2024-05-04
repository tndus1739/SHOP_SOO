package com.shop.back.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.back.order.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
