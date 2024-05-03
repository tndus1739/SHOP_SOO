package com.shop.back.payment.kakaopay;

import com.shop.back.item.entity.Item;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.member.entity.Member;
import com.shop.back.payment.entity.Payment;
import com.shop.back.payment.entity.PaymentHistory;
import com.shop.back.payment.repository.PaymentHistoryRepository;
import com.shop.back.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoPay {

	private static final String HOST = "https://kapi.kakao.com";

	private KakaoPayReadyVO kakaoPayReadyVO;
	private KakaoPayApprovalVO kakaoPayApprovalVO;

	private final ItemRepository itemRepository;

	private Member member;

	private PaymentHistory payHistory = new PaymentHistory();

	private List<Payment> paymentList = new ArrayList<>();

	private final PaymentHistoryRepository paymentHistoryRepository;
	private final PaymentRepository paymentRepository;


	public String kakaoPayReady(List<KakaoReqDto> payData, Member mb) {

		String title = "";
		String total_price = "0";
		List<String> titles = new ArrayList<>();
		int amount = 0;
		for(KakaoReqDto dto : payData) {
			Optional<Item> op = itemRepository.findById(dto.getItemId());
			if(op.isPresent()) {
				Item item = op.get();
				titles.add(item.getName() + "("+ item.getColors().getName() +", " + item.getItemSize() + ") " + dto.getCnt() + "개");
				amount += (item.getSalePrice() + item.getOptionPrice()) * dto.getCnt();
				Payment pay = new Payment();
				pay.setCnt(dto.getCnt());
				pay.setPrice((item.getSalePrice() + item.getOptionPrice()) * dto.getCnt());
				pay.setItem(item);
				pay.setTitle(item.getName() + "("+ item.getColors().getName() +", " + item.getItemSize() + ") " + dto.getCnt() + "개");
				paymentList.add(pay);
			} else {

			}
		}

		title = String.join(", ", titles);
		if(title.length() > 90) {
			title = title.substring(0, 90) + "...";
		}
		total_price = String.valueOf(amount);
		member = mb;

		RestTemplate restTemplate = new RestTemplate();

		// 서버로 요청할 Header
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "KakaoAK " + "e3ad6bf0f7f23b72e080ff28511fe94d");
		headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
		headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");

		// 서버로 요청할 Body
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.add("cid", "TC0ONETIME");
		params.add("partner_order_id", "1002");
		params.add("partner_user_id", "Test");
		params.add("item_name", title);
		params.add("quantity", "1");
		params.add("total_amount", total_price);
		params.add("tax_free_amount", "0");
		params.add("approval_url", "http://localhost:3011/pay/kakaopay/complete");
		params.add("cancel_url", "http://localhost:8011/pay/kakaopay/cancel");
		params.add("fail_url", "http://localhost:8011/pay/kakaopay/successFail");

		HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<MultiValueMap<String, String>>(params, headers);

		try {
			kakaoPayReadyVO = restTemplate.postForObject(new URI(HOST + "/v1/payment/ready"), body, KakaoPayReadyVO.class);
			kakaoPayReadyVO.setItem_name(title);
			kakaoPayReadyVO.setPrice(Integer.parseInt(total_price));
			log.info("" + kakaoPayReadyVO);

			return kakaoPayReadyVO.getNext_redirect_pc_url();

		} catch (RestClientException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "/pay";

	}

	public KakaoPayApprovalVO kakaoPayInfo(String pg_token) {

		log.info("....................KakaoPayInfoVO........................");
		log.info("-----------------------------");
		log.info(kakaoPayReadyVO.toString());

		RestTemplate restTemplate = new RestTemplate();

		// 서버로 요청할 Header
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "KakaoAK " + "e3ad6bf0f7f23b72e080ff28511fe94d");
		headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
		headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");

		// 서버로 요청할 Body
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		params.add("cid", "TC0ONETIME");
		params.add("tid", kakaoPayReadyVO.getTid());
		params.add("partner_order_id", "1002");
		params.add("partner_user_id", "Test");
		params.add("pg_token", pg_token);
		params.add("total_amount", String.valueOf(kakaoPayReadyVO.getPrice()));

		HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<MultiValueMap<String, String>>(params, headers);

		try {
			kakaoPayApprovalVO = restTemplate.postForObject(new URI(HOST + "/v1/payment/approve"), body, KakaoPayApprovalVO.class);
			log.info("" + kakaoPayApprovalVO);
			log.info("member : " + member.getEmail());
		//  결제정보 db에 저장
			payHistory.setPayType("KakaoPay");
			payHistory.setTid(kakaoPayApprovalVO.getTid());
			payHistory.setTitle(kakaoPayReadyVO.getItem_name());
			payHistory.setTotalPrice(kakaoPayReadyVO.getPrice());
			System.out.println("payhistory : ");
			PaymentHistory savedPayHistory = paymentHistoryRepository.save(payHistory);
			for(Payment payment : paymentList) {
				payment.setPaymentHistory(savedPayHistory);
				Payment savedPay = paymentRepository.save(payment);
			}

			return kakaoPayApprovalVO;

		} catch (RestClientException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

}