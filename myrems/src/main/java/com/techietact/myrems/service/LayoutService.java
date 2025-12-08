package com.techietact.myrems.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.techietact.myrems.bean.LayoutBO;
import com.techietact.myrems.entity.Layout;

public interface LayoutService {

	Layout createLayout(LayoutBO layoutBO);

	 //List<LayoutBO> getAllLayouts();

	//LayoutBO getLayoutById(Long id);

	LayoutBO updateLayout(String layoutName, LayoutBO layoutBO);

	void deleteLayout(String layoutName);

	//Page<Layout> getLayouts(int page, int size);

	List<Layout> findAllLayoutsAsc();

	LayoutBO getLayoutByLayoutName(String layoutName);

	List<Layout> getAllLayouts();

}
