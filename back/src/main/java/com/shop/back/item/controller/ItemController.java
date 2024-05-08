package com.shop.back.item.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shop.back.item.dto.ItemDto;
import com.shop.back.item.dto.ItemFormDto;
import com.shop.back.item.dto.ItemGroupDto;
import com.shop.back.item.entity.File_item;
import com.shop.back.item.entity.Item;
import com.shop.back.item.entity.ItemGroup;
import com.shop.back.item.repository.File_itemRepository;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.item.service.File_itemService;
import com.shop.back.item.service.ItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
//@Tag(name = "ItemController", description = "상품 API")
@RestController
@RequestMapping("/item")
//@CrossOrigin("*")  //모든 도메인, 모든 요청방식' 에 대해 허용
@RequiredArgsConstructor
public class ItemController {

	 @Autowired
	    private final ItemService itemService;
	 	private final ItemRepository itemRepository;
	 	private final File_itemService file_itemService;
	 	
	 	
	 	// 상품 전체 리스트 조회 
	    @GetMapping
	    @Operation (summary = "getAllItems() : 상품 전체 리스트를 조회하는 API")
	    public List<Item> getAllItems() {
	    	List<Item> itemList = itemService.getItemList();
	    	System.out.println("상품리스트 조회성공");
	        return itemService.getItemList();
	    }
	    
	    // 상품 상세 정보
	    @GetMapping("/{id}")
	    @Operation (summary = "getItemById) : 상품 상세페이지를 조회하는 API")
	    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
	        Item item = itemService.getItemById(id);
	        return new ResponseEntity<>(item, HttpStatus.OK);
	    }
	    
	 // 상품 등록
	    @PostMapping
	    @PreAuthorize("hasRole('ADMIN')")
	    @Operation (summary = "post() : 상품 정보를 등록하는 API")
		public ResponseEntity<?> post(
				@RequestBody ItemFormDto itemFormDto 
				
		) {
	    	ItemGroup itemGroup = new ItemGroup();
			 try {
				 // 상품 정보 저장
				itemGroup = itemService.saveItem (itemFormDto);
				 
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			return ResponseEntity.ok(itemGroup);
		}
	    
	    // 상품 이미지 등록
		@PostMapping("/files")
		@Operation (summary = "post() : 상품이미지를 등록하는 API")
		public ResponseEntity<?> post(
				@RequestParam("file_item") List<MultipartFile> file_item,
				@RequestParam("isMain") int index,
				@RequestParam("itemGroupId") Long itemGroupId
		) {
			
			
			
			try {
				
				file_itemService.saveItemImg( file_item , index ,itemGroupId);
				
			} catch (IOException e) {
				
				e.printStackTrace();
			}

			return ResponseEntity.ok(itemGroupId);
		}
	    
	     
	    
	    // 상품 수정 
	    @PutMapping("/{id}")
	    @Operation (summary = "updateItem() : 상품 정보를 수정하는 API")
	    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item updatedItem) {
	        Item updated = itemService.updateItem(id, updatedItem);
	        return new ResponseEntity<>(updated, HttpStatus.OK);
	    }
	    
	    // 상품 삭제
	    @DeleteMapping("/{id}")
	    @Operation (summary = "deleteIte() : 상품 정보를 수정하는 API")
	    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
	        itemService.deleteItem(id);
	        return ResponseEntity.noContent().build();
	    }
}
