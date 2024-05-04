package com.shop.back.like.service;

import com.shop.back.item.entity.ItemGroup;
import com.shop.back.item.repository.ItemGroupRepository;
import com.shop.back.like.entity.Likes;
import com.shop.back.like.repository.LikesRepositroy;
import com.shop.back.member.entity.Member;
import com.shop.back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikesService {
	private final LikesRepositroy likesRepositroy;
	private final ItemGroupRepository itemGroupRepository;
	private final MemberRepository memberRepository;

	public void post(Long itemGroupId, String email) {
		Member member =  memberRepository.findByEmail(email);
		Optional.ofNullable(member).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
		if(!member.getRole().equals("USER") || !member.getRole().equals("ADMIN")) {
			new RuntimeException("권한 문제");
		}

		Optional<ItemGroup> op = itemGroupRepository.findById(itemGroupId);
		if(!op.isPresent()) {
			new RuntimeException("해당 상품이 존재하지 않습니다.");
		}
		ItemGroup itemGroup = op.get();

		Optional<Likes> opl = likesRepositroy.findByMemberAndItemGroup(member, itemGroup);
		if(opl.isPresent()) {
			likesRepositroy.delete(opl.get());
		} else {
			Likes likes = new Likes();
			likes.setMember(member);
			likes.setItemGroup(itemGroup);
			likes.setDel(1);
			likesRepositroy.save(likes);
		}
	}

	public List<Likes> get(String email) {
		Member member =  memberRepository.findByEmail(email);
		Optional.ofNullable(member).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
		if(!member.getRole().equals("USER") || !member.getRole().equals("ADMIN")) {
			new RuntimeException("권한 문제");
		}
		List<Likes> list = likesRepositroy.findByMemberAndDel(member, 1);

		return list;
	}
}
