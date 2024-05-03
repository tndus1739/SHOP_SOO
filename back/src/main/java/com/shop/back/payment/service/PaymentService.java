package com.shop.back.payment.service;

import com.shop.back.payment.repository.PaymentHistoryRepository;
import com.shop.back.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
	private final PaymentRepository paymentRepository;
	private final PaymentHistoryRepository paymentHistoryRepository;

	public void pay() {

	}

}
