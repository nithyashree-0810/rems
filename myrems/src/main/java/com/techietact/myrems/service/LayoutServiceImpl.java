package com.techietact.myrems.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
        BeanUtils.copyProperties(layoutBO, layout);
        return layoutRepository.save(layout);
    }

    @Override
    public List<Layout> findAllLayoutsAsc() {
        return layoutRepository.findAll();
    }

    @Override
    public List<Layout> getAllLayouts() {
        return layoutRepository.findAll();
    }

    @Override
    public LayoutBO getLayoutByLayoutName(String layoutName) {
        return layoutRepository.findById(layoutName)
                .map(layout -> {
                    LayoutBO layoutBO = new LayoutBO();
                    BeanUtils.copyProperties(layout, layoutBO);
                    return layoutBO;
                })
                .orElse(null);
    }

    @Override
    public LayoutBO updateLayout(String layoutName, LayoutBO layoutBO) {
        return layoutRepository.findById(layoutName)
                .map(existing -> {
                    BeanUtils.copyProperties(layoutBO, existing, "layoutName");
                    Layout updated = layoutRepository.save(existing);
                    LayoutBO response = new LayoutBO();
                    BeanUtils.copyProperties(updated, response);
                    return response;
                })
                .orElse(null);
    }

    @Override
    public void deleteLayout(String layoutName) {
        layoutRepository.deleteById(layoutName);
    }

    @Override
    public List<Layout> searchLayouts(String layoutName, String location) {
        return layoutRepository.findAll(); // your custom logic already exists
    }

    @Override
    public Layout saveLayout(Layout savedLayout) {
        return layoutRepository.save(savedLayout);
    }

    @Override
    public Layout getLayoutEntity(String layoutName) {
        return layoutRepository.findById(layoutName).orElse(null);
    }

	@Override
	public List<Layout> findByLayoutNameAndLocation(String layoutName, String location) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Layout> findByLayoutName(String layoutName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Layout> findByLocation(String location) {
		// TODO Auto-generated method stub
		return null;
	}
	
	 @Override
	    public void updateLayoutFromBO(Layout existingLayout, LayoutBO layoutBO) {
	        // Copy all fields from BO to entity except pdfPath
	        BeanUtils.copyProperties(layoutBO, existingLayout, "pdfPath");
	    }

}
