package com.shop.back.category.controller;

import com.shop.back.category.dto.CategoryFormDto;
import com.shop.back.category.dto.Sidebar;
import com.shop.back.category.entity.Category;
import com.shop.back.category.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin/category")
@RequiredArgsConstructor
public class AdminCategoryController {
	private final CategoryService categoryService;

	@PostMapping
	@Operation (summary = "post() : 카테고리 등록 API")
	public ResponseEntity<?> post(@RequestBody CategoryFormDto category) {
		String msg = "error";
		try {
			categoryService.insertCategory(category);
			msg = "success";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(msg);
	}

	@GetMapping
	@Operation (summary = "getList() : 카테고리 목록 조회 API")
	public ResponseEntity<?> getList(@RequestParam(name = "parentId" ,required = false) Long parentId) {
		List<Category> list = new ArrayList<>();
		try {
			list = categoryService.getList(parentId, 1);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(list);
	}

	@DeleteMapping
	@Operation (summary = "delete() : 카테고리 삭제 API")
	public ResponseEntity<?> delete(@RequestParam("id") Long id) {
		String msg = "error";
		try {
			categoryService.delete(id);
			msg = "success";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(msg);
	}

	@GetMapping("/all")
	public ResponseEntity<?> all() {
		System.out.println("---------------------------------------------------------");
		List<Category> all = new ArrayList<>();
		try {
			all = categoryService.getList(null, 1);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("---------------------------------------------------------");
		return ResponseEntity.ok(all);
	}
}
