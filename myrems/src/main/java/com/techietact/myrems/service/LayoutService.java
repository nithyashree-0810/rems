package com.techietact.myrems.service;

import java.util.List;

import com.techietact.myrems.bean.LayoutBO;
import com.techietact.myrems.entity.Layout;

public interface LayoutService {

    Layout createLayout(LayoutBO layoutBO);

    LayoutBO updateLayout(String layoutName, LayoutBO layoutBO);

    void deleteLayout(String layoutName);

    List<Layout> findAllLayoutsAsc();

    LayoutBO getLayoutByLayoutName(String layoutName);

    List<Layout> getAllLayouts();

    List<Layout> findByLayoutNameAndLocation(String layoutName , String location);

    List<Layout> findByLayoutName(String layoutName);

    List<Layout> findByLocation(String location);

    List<Layout> searchLayouts(String layoutName, String location);

    Layout saveLayout(Layout savedLayout);

    // ⭐ IMPORTANT
    Layout getLayoutEntity(String layoutName);
}
