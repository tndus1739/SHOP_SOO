package com.shop.back.payment.repository;

import com.shop.back.member.entity.Member;
import com.shop.back.payment.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    List<PaymentHistory> findByMemberOrderByIdDesc(Member member);
}
