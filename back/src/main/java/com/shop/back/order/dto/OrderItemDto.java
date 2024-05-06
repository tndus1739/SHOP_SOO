package com.shop.back.order.dto;

import com.shop.back.order.entity.OrderItem;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter

public class OrderItemDto {    // 주문 상품 정보
	
	
    private String name; 
    private int count; 

    private int orderPrice; 
    private String path; 
    
    public OrderItemDto(OrderItem orderItem, String path){
        this.name = orderItem.getItem().getName();
        this.count = orderItem.getCount();
        this.orderPrice = orderItem.getOrderPrice();
        this.path = path;
    }

}
