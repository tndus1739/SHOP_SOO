package com.shop.back.order.dto;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.shop.back.order.entity.Orders;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderHistoryDto  {   // 주문 정보

    public OrderHistoryDto(Orders order){
        this.orderId = order.getId();
        this.orderDate = order.getRegDate().format(DateTimeFormatter.ofPattern("yyyy-mm-dd HH:mm"));
        this.orderStatus = order.getStatus();
    }

    private Long orderId; //주문아이디
    private String orderDate; //주문날짜
    private String orderStatus; //주문 상태

    private List<OrderItemDto> orderItemDtoList = new ArrayList<>();

    //주문 상품리스트에 추가
    public void addOrderItemDto(OrderItemDto orderItemDto){
        orderItemDtoList.add(orderItemDto);
    }
	
}
