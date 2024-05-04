package com.shop.back.like.repository;

import com.shop.back.item.entity.ItemGroup;
import com.shop.back.like.entity.Likes;
import com.shop.back.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikesRepositroy extends JpaRepository<Likes, Long> {
	Optional<Likes> findByMemberAndItemGroup(Member member, ItemGroup itemGroup);

	List<Likes> findByMemberAndDel(Member member, int del);
}
