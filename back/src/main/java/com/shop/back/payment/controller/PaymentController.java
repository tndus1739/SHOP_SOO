package com.shop.back.payment.controller;

import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.member.service.MemberService;
import com.shop.back.payment.entity.Payment;
import com.shop.back.payment.entity.PaymentHistory;
import com.shop.back.payment.kakaopay.KakaoPay;
import com.shop.back.payment.kakaopay.KakaoPayApprovalVO;
import com.shop.back.payment.kakaopay.KakaoReqDto;
import com.shop.back.payment.repository.PaymentHistoryRepository;
import com.shop.back.payment.repository.PaymentRepository;
import com.shop.back.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.*;

@Slf4j
@Controller
@RequestMapping("/pay")
@RequiredArgsConstructor
public class PaymentController {

    @Setter(onMethod_ = @Autowired)
    private KakaoPay kakaopay;

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentService paymentService;

    @PostMapping("/kakaopay")
    public ResponseEntity<?> kakaoPay(@RequestBody List<KakaoReqDto> payData) {
        log.info(".....................kakaoPay post.......................");
        Map<String, String> res = new HashMap<>();
        System.out.println(payData);
        if (payData.size() > 0) {
            Member member = memberRepository.findByEmail(payData.get(0).getEmail());
            String next_redirect_pc_url = kakaopay.kakaoPayReady(payData, member);
            if (!next_redirect_pc_url.equals("error")) {
                res.put("next_redirect_pc_url", next_redirect_pc_url);
                res.put("msg", "success");
            } else {
                res.put("msg", "error");
            }
        } else {
            res.put("msg", "error");
        }

        return ResponseEntity.ok(res);
    }

    @RequestMapping("/kakaopay/complete")
    public String kakaoPaySuccess(@RequestParam("pg_token") String pg_token, Model model) {
        log.info("......................kakaoPaySuccess get......................");
        log.info("kakaoPaySuccess pg_token : " + pg_token);
        KakaoPayApprovalVO payInfo = new KakaoPayApprovalVO();
        payInfo = kakaopay.kakaoPayInfo(pg_token);
        return "complete";
    }

    @RequestMapping("/kakaopay/successFail")
    public String kakaoPaySuccessFail() {
        kakaopay.setPaymentList(new ArrayList<>());
        return "kakaoPaySuccessFail";
    }

    @RequestMapping("/kakaopay/cancel")
    public String kakaoPayCancel() {
        kakaopay.setPaymentList(new ArrayList<>());
        return "kakaoPayCancel";
    }

    @GetMapping("/history/{email}")
    public ResponseEntity<?> mypageHistory(@PathVariable("email") String email) {
        List<PaymentHistory> list = new ArrayList<>();
        Member member = memberRepository.findByEmail(email);
        Optional.ofNullable(member).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        if (!member.getRole().equals("USER") || !member.getRole().equals("ADMIN")) {
            new RuntimeException("권한 문제");
        }
        list = paymentService.historyMember(member);
        return ResponseEntity.ok(list);
    }
}
