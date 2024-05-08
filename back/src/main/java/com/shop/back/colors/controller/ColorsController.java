package com.shop.back.colors.controller;

import com.shop.back.colors.entity.Colors;
import com.shop.back.colors.service.ColorsService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/colors")
public class ColorsController {
	private final ColorsService colorsService;

	@PostMapping
	@Operation (summary = "post() : 상품 색상을 등록하는 API")
	public ResponseEntity<?> post(@RequestBody Colors colors) {
		colorsService.post(colors);
		return ResponseEntity.ok(colors);
	}

	@GetMapping
	@Operation (summary = "getList() : 상품 색상 목록을 조회하는 API")
	public ResponseEntity<?> getList() {
		List<Colors> list = new ArrayList<>();
		try {
			list = colorsService.getList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(list);
	}
}
