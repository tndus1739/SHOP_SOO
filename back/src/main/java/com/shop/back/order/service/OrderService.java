package com.shop.back.order.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.shop.back.item.entity.File_item;
import com.shop.back.item.entity.Item;
import com.shop.back.item.repository.File_itemRepository;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.order.dto.OrderDto;
import com.shop.back.order.dto.OrderHistoryDto;
import com.shop.back.order.dto.OrderItemDto;
import com.shop.back.order.entity.OrderItem;
import com.shop.back.order.entity.Orders;
import com.shop.back.order.repository.OrderRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
	
	private final ItemRepository itemRepository;
	private final File_itemRepository file_itemRepository;
	private final MemberRepository memberRepository;
	private final OrderRepository orderRepository;
	
	
	

	// 장바구니에 있는 상품을 주문
	
    public Long saveOrder(List<OrderDto> orderDtoList, String email){
    	
    	// 사용자 조회
        Member member = memberRepository.findByEmail(email);
        
        if (member == null) {
            throw new EntityNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다: " + email);
        }
        
       // 주문 상품 리스트 생성
        
        List<OrderItem> orderItemList = new ArrayList<>();

        for (OrderDto orderDto : orderDtoList) {
        	
        	// 주문 상품에 해당하는 상품 조회
        	
            Item item = itemRepository.findById(orderDto.getItemId())
            		 .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. 상품 ID: " + orderDto.getItemId()));
            
            // 주문 상품 생성
            OrderItem orderItem = OrderItem.createOrderItem(item, orderDto.getCount());
            orderItemList.add(orderItem);
        }
        
        // 주문 생성
        Orders order = Orders.createOrder(member, orderItemList);
        orderRepository.save(order);

        return order.getId();
    }

    
    // 상품 상세페이징테서 바로 주문
    
    public Long order(OrderDto orderDto, String email){

        Item item = itemRepository.findById(orderDto.getItemId())
                .orElseThrow(EntityNotFoundException::new);

        Member member = memberRepository.findByEmail(email);

        List<OrderItem> orderItemList = new ArrayList<>();
        OrderItem orderItem = OrderItem.createOrderItem(item, orderDto.getCount());
        orderItemList.add(orderItem);
        Orders order = Orders.createOrder(member, orderItemList);
        orderRepository.save(order);

        return order.getId();
    }
    
   //  주문 목록 조회
    @Transactional
    public List <OrderHistoryDto> getOrderList(String email) {

        List<Orders> orders = orderRepository.findByMemberEmail(email);
       

        List<OrderHistoryDto> orderHistoryDto = new ArrayList<>();

        for (Orders order : orders) {
            OrderHistoryDto orderHistoryDtos = new OrderHistoryDto(order);
            List<OrderItem> orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                File_item file_item = file_itemRepository.findByIdAndIsMainOrderByIdAsc(orderItem.getItem().getId(), 1);
                OrderItemDto orderItemDto =
                        new OrderItemDto(orderItem, file_item.getPath());
                orderHistoryDtos.addOrderItemDto(orderItemDto);
            }

            orderHistoryDto.add(orderHistoryDtos);
        }

        return orderHistoryDto;
    }
    
    
    // 주문 취소

    public void cancelOrder(Long orderId){
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(EntityNotFoundException::new);
        order.setDel(0);  // 주문취소시 0으로 변경
        order.cancelOrder();
        orderRepository.save(order);
    }

}




