package com.techietact.myrems.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.techietact.myrems.bean.LayoutBO;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.repository.LayoutRepository;

@Service
public class LayoutServiceImpl implements LayoutService {
	
	@Autowired
	private LayoutRepository layoutRepository;

	@Override
	public Layout createLayout(LayoutBO layoutBO) {
	    Layout layout = new Layout();
	    BeanUtils.copyProperties(layoutBO, layout); // copies matching fields
	    return layoutRepository.save(layout);
	}


	@Override
	public List<Layout> findAllLayoutsAsc() {
		// TODO Auto-generated method stub
		return layoutRepository.findAllByOrderByCreatedDateAsc();
                
	}
	
	@Override
	public List<Layout> getAllLayouts() {
        return layoutRepository.findAll();
    }

	@Override
	public LayoutBO getLayoutByLayoutName(String layoutName) {
		// TODO Auto-generated method stub
		return layoutRepository.findByLayoutName(layoutName)
                .map(layout -> {
                    LayoutBO layoutBO = new LayoutBO();
                    BeanUtils.copyProperties(layout, layoutBO);
                    return layoutBO;
                })
                .orElse(null);
	}

	@Override
	public LayoutBO updateLayout(String layoutName, LayoutBO layoutBO) {
		// TODO Auto-generated method stub
		return layoutRepository.findByLayoutName(layoutName)
                .map(existing -> {
                    BeanUtils.copyProperties(layoutBO, existing, "layoutName"); // keep id unchanged
                    Layout updated = layoutRepository.save(existing);
                    LayoutBO response = new LayoutBO();
                    BeanUtils.copyProperties(updated, response);
                    return response;
                })
                .orElse(null);
	}

	@Override
	public void deleteLayout(String layoutName) {
		// TODO Auto-generated method stub
		layoutRepository.deleteById(layoutName);
	}


	
}
