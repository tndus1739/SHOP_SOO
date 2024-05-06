package com.shop.back.item.repository;

import java.util.List;

import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.back.item.entity.File_item;

public interface File_itemRepository extends JpaRepository <File_item, Long>{
	
	List<File_item> findByIdOrderByIdAsc(Long Id);
	
//	List<File_item> findByItemIdAndIsMainOrderByItemIdAsc(Long itemId, int isMain);

	File_item findByIdAndIsMainOrderByIdAsc(Long Id, int isMain);
	
}
