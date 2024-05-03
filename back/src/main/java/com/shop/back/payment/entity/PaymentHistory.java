package com.shop.back.payment.entity;

import com.shop.back.item.entity.Item;
import com.shop.back.order.entity.Orders;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class PaymentHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String tid;

	private String title;

	private String payType;     // KakaoPay

	private int totalPrice;

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_id")
	private List<Payment> paymentList;
}
