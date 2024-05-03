package com.shop.back.payment.controller;

import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.member.service.MemberService;
import com.shop.back.payment.kakaopay.KakaoPay;
import com.shop.back.payment.kakaopay.KakaoPayApprovalVO;
import com.shop.back.payment.kakaopay.KakaoReqDto;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Controller
@RequestMapping("/pay/kakaopay")
@RequiredArgsConstructor
public class PaymentController {

	@Setter(onMethod_ = @Autowired)
	private KakaoPay kakaopay;

	private final MemberService memberService;
	private final MemberRepository memberRepository;

	@PostMapping
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

	@RequestMapping("/complete")
	public String kakaoPaySuccess(@RequestParam("pg_token") String pg_token, Model model) {
		log.info("......................kakaoPaySuccess get......................");
		log.info("kakaoPaySuccess pg_token : " + pg_token);
		KakaoPayApprovalVO payInfo = new KakaoPayApprovalVO();
		payInfo = kakaopay.kakaoPayInfo(pg_token);
		return "complete";
	}

	@RequestMapping("/successFail")
	public String kakaoPaySuccessFail() {
		return "kakaoPaySuccessFail";
	}

	@RequestMapping("/cancel")
	public String kakaoPayCancel() {
		return "kakaoPayCancel";
	}
}
