package com.shop.back.payment.entity;

import com.shop.back.item.entity.Item;
import com.shop.back.order.entity.Orders;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Payment {      //  상품별
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String title;

	private int price;          // 결제 금액

	private int cnt;            // 수량

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "paymentHistory_id")
	private PaymentHistory paymentHistory;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_id")
	private Item item;
}
