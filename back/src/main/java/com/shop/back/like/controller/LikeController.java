package com.shop.back.like.controller;

import com.shop.back.like.entity.Likes;
import com.shop.back.like.service.LikesService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {
	private final LikesService likesService;

	@PostMapping("/{itemGroupId}/{email}")
	@Operation (summary = "post() : 상품에 좋아요 생성하는 API")
	public ResponseEntity<?> post(@PathVariable("itemGroupId") Long itemGroupId, @PathVariable("email") String email) {
		Map<String, String> res = new HashMap<>();
		likesService.post(itemGroupId, email);

		return ResponseEntity.ok(res);
	}

	@GetMapping("/{email}")
	@Operation (summary = "get() : 좋아요 리스트를 조회하는 API")
	public ResponseEntity<?> get(@PathVariable("email") String email) {
		System.out.println(email);
		List<Likes> list = likesService.get(email);
		for(Likes likes : list) {
			likes.getItemGroup().setItems(null);
		}

		return ResponseEntity.ok(list);
	}
}
