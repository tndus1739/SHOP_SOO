package com.shop.back.payment.service;

import com.shop.back.member.entity.Member;
import com.shop.back.payment.entity.Payment;
import com.shop.back.payment.entity.PaymentHistory;
import com.shop.back.payment.repository.PaymentHistoryRepository;
import com.shop.back.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
	private final PaymentRepository paymentRepository;
	private final PaymentHistoryRepository paymentHistoryRepository;

	public void pay() {

	}

	public List<PaymentHistory> historyMember(Member member) {
		List<PaymentHistory> list = paymentHistoryRepository.findByMemberOrderByIdDesc(member);
		for(PaymentHistory ph : list) {
			for(Payment payment : ph.getPaymentList()) {
				payment.setPaymentHistory(null);
				payment.getItem().getItemGroup().setItems(null);
			}
		}
		return list;
	}

}
