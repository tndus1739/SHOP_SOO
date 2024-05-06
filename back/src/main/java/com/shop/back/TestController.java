package com.shop.back;

import com.shop.back.cart.entity.Cart;
import com.shop.back.category.entity.Category;
import com.shop.back.category.repository.CategoryRepository;
import com.shop.back.item.dto.ItemFormDto;
import com.shop.back.item.entity.File_item;
import com.shop.back.item.entity.Item;
import com.shop.back.item.entity.ItemGroup;
import com.shop.back.item.repository.ItemGroupRepository;
import com.shop.back.item.repository.ItemRepository;
import com.shop.back.like.entity.Likes;
import com.shop.back.member.dto.request.JoinRequest;
import com.shop.back.member.dto.response.JoinResponse;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import com.shop.back.order.entity.OrderItem;
import com.shop.back.order.entity.Orders;
import com.shop.back.order.repository.OrderItemRepository;
import com.shop.back.order.repository.OrderRepository;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
@RestController
@RequiredArgsConstructor
public class TestController {
	private final CategoryRepository categoryRepository;
	private final ItemGroupRepository itemGroupRepository;
	private final ItemRepository itemRepository;
	private final MemberRepository memberRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

//	@PostMapping("/test")
//	public ResponseEntity<?> test() {
//		System.out.println("test=============================================== ");
//		System.out.println("test : ");
//		System.out.println("test=============================================== ");
//		return ResponseEntity.ok("test");
//	}

//	@PostMapping("/item")
//	public ResponseEntity<?> post(
//			@RequestBody ItemFormDto itemFormDto
//	) {
//		System.out.println(itemFormDto);
//		ItemGroup itemGroup = new ItemGroup();
//		itemGroup.setId(1L);
//		return ResponseEntity.ok(itemGroup);
//	}
//
//	@PostMapping("/item/files")
//	public ResponseEntity<?> post(
//			@RequestParam("file_item") List<MultipartFile> aa,
//			@RequestParam("isMain") int index,
//			@RequestParam("itemGroupId") Long itemGroupId
//	) {
//		System.out.println("리스트 사이즈 : " + aa.size());
//		System.out.println("메인 이미지 index : " + index);
//		System.out.println("아이템 그룹 Id : " + itemGroupId);
//
//		return ResponseEntity.ok(itemGroupId);
//	}

	//회원가입
//	@PostMapping("/member/join/test")
//	public ResponseEntity<?> join(@RequestBody JoinRequest req) {
//		System.out.println("MemberController join " + new Date());
//		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//		LocalDate localDate = LocalDate.parse(req.getBirthString(), formatter);
//
//		LocalDateTime localDateTime = localDate.atTime(LocalTime.MIDNIGHT);
//		req.setBirth(localDateTime);
//
//		return ResponseEntity.ok(req);
//	}

	@GetMapping("/items/test/{categoryId}")
	public ResponseEntity<?> itemsTest(@PathVariable("categoryId") Long categoryId) {
		System.out.println("=====================================================");
		System.out.println(categoryId);
		Category category = categoryRepository.findById(categoryId).get();

		List<ItemGroup> itemGroupList = itemGroupRepository.findByCategoryAndDelAndIsView(categoryId);
		for(ItemGroup itemGroup : itemGroupList) {
			for(Item item : itemGroup.getItems()) {
				item.setItemGroup(null);
			}
		}

		return ResponseEntity.ok(itemGroupList);
	}

	//  상품 상세 페이지
	@GetMapping("/item/test/{itemGroupId}")
	public ResponseEntity<?> itemTest(@PathVariable("itemGroupId") Long itemGroupId) {
		System.out.println("=====================================================");
		System.out.println(itemGroupId);

		ItemGroup itemGroup = itemGroupRepository.findById(itemGroupId).get();
		for(Item item : itemGroup.getItems()) {
			item.setItemGroup(null);
		}
		System.out.println(itemGroup);

		return ResponseEntity.ok(itemGroup);
	}

	@PostMapping("/test/likes/{itemGroupId}")
	public ResponseEntity<?> likeTest(@PathVariable("itemGroupId") Long itemGroupId) {
		ItemGroup itemGroup = itemGroupRepository.findById(itemGroupId).get();
//		Optional<Likes> op = likeRepository.findByItemGroup(itemGroup);
//		Likes like = null;
//		if(op.isPresent()) {
//			like = op.get();
//		    if(like.getDel() == 1) {
//			    like.setDel(0);
//		        likeRepository.save(like);
//		    }
//		} else {
//		    여기서 insert?
//	    }

		return ResponseEntity.ok(itemGroup);
	}

	@GetMapping("/admin/items/test")
	public ResponseEntity<?> adminItemsTest() {
		System.out.println("=====================================================");

		List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
		for(ItemGroup itemGroup : itemGroupList) {
			for(Item item : itemGroup.getItems()) {
				item.setItemGroup(null);
			}
		}

		return ResponseEntity.ok(itemGroupList);
	}

	@GetMapping("/admin/category/parent/{categoryId}")
	public ResponseEntity<?> adminCategoryTest(@PathVariable("categoryId") Long categoryId) {
		Category child = categoryRepository.findById(categoryId).get();
		Category parent = child.getParentCategory();

		return ResponseEntity.ok(parent);
	}

	@GetMapping("/item/index")
	public ResponseEntity<?> mainPage() {
		List<ItemGroup> list = itemGroupRepository.findAll();
		for(ItemGroup itemGroup : list) {
			for(Item item : itemGroup.getItems()) {
				item.setItemGroup(null);
			}
		}
		return ResponseEntity.ok(list);
	}

	@PostMapping("/item/order/test")
	public ResponseEntity<?> order(@RequestBody List<OrderDtoTest> orderDtoTest) {
		System.out.println(orderDtoTest);
		Member member = null;
		String email = "";
		Long orderId = null;
		if(!orderDtoTest.isEmpty()) {
			email = orderDtoTest.get(0).getEmail();
			member = memberRepository.findByEmail(email);
			Optional.ofNullable(member).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
			if(!member.getRole().equals("USER") || !member.getRole().equals("ADMIN")) {
				new RuntimeException("권한 문제");
			}
		} else {
			new RuntimeException("주문정보가 null입니다.");
		}

		Orders orders = new Orders();
		orders.setDel(1);
		orders.setMember(member);
		orders.setStatus("결제대기");
		orderId = orderRepository.save(orders).getId();

		for(OrderDtoTest odt : orderDtoTest) {
			Optional<Item> opi = itemRepository.findById(odt.getItemId());
			if(opi.isPresent()) {
				Item item = opi.get();
				OrderItem orderItem = OrderItem.createOrderItem(item, odt.getCount());
				orderItem.setOrders(orders);
				orderItemRepository.save(orderItem);
			}
		}

		return ResponseEntity.ok(orderId);
	}

	@GetMapping("/order/test/{email}/{orderId}")
	public ResponseEntity<?> getOrder(@PathVariable("email") String email, @PathVariable("orderId") Long orderId) {
		Optional<Orders> op = orderRepository.findById(orderId);
		Orders orders = null;
		if(op.isPresent()) {
			orders = op.get();
			for(OrderItem oi : orders.getOrderItems()) {
				oi.setOrders(null);
				oi.getItem().getItemGroup().setItems(null);
			}
		} else {
            throw new RuntimeException("주문정보를 찾을 수 없습니다.");
		}


		return ResponseEntity.ok(orders);
	}
}

@Data
class OrderDtoTest {
	private Long ItemId;
	private int count;
	private String email;
}
