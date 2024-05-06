package com.shop.back.order.entity;

import java.util.ArrayList;
import java.util.List;

import com.shop.back.common.BaseEntity;
import com.shop.back.item.entity.Item;
import com.shop.back.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Orders extends BaseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "order_id")
	private Long id;

	private String status;    // 결제대기 , 결제완료

	private int del;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;
	
	
	@OneToMany(fetch = FetchType.LAZY , cascade = CascadeType.ALL)  // mappedBy : 연관관계의 주인
	@JoinColumn(name = "order_id")
	private List<OrderItem> orderItems = new ArrayList<>();
	
	
	public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrders(this);
    }
	
	public static Orders createOrder(Member member, List<OrderItem> orderItemList) {
        Orders order = new Orders();
        order.setMember(member);

        for(OrderItem orderItem : orderItemList) {
            order.addOrderItem(orderItem);
        }

        order.setStatus("결제대기");
        return order;
    }

	 public int getTotalPrice() {
	        int totalPrice = 0;
	        for(OrderItem orderItem : orderItems) {
	            totalPrice += orderItem.getTotalPrice();
	        }
	        return totalPrice;
	    }
	 
	 
	 public void cancelOrder() {
	        this.status = "주문취소";
	        for (OrderItem orderItem : orderItems) {
	            orderItem.cancel();
	        }
	    }
	 
}
