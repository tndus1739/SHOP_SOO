package com.shop.back.order.entity;

import com.shop.back.common.BaseEntity;
import com.shop.back.item.entity.Item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter 
@Setter
public class OrderItem extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "order_item_id")
	 private Long id ;
	 
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
	 private Item item;
	 
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
	 private Orders orders;
	 
	 private int orderPrice;
	 
	 private int count;
	 
	 
	 public static OrderItem createOrderItem(Item item, int count){
	        OrderItem orderItem = new OrderItem();
	        orderItem.setItem(item);
	        orderItem.setCount(count);
	        orderItem.setOrderPrice(item.getTotal());
	        item.reducedCount(count);
	        return orderItem;
	    }
	 
}
