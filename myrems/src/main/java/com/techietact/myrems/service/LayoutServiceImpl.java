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
        return layoutRepository.findAllByOrderByCreatedDateAsc();
    }

    @Override
    public List<Layout> getAllLayouts() {
        return layoutRepository.findAll();
    }

    @Override
    public LayoutBO getLayoutByLayoutName(String layoutName) {
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
        return layoutRepository.findByLayoutName(layoutName)
                .map(existing -> {
                    BeanUtils.copyProperties(layoutBO, existing, "id", "createdDate");
                    Layout updated = layoutRepository.save(existing);
                    LayoutBO response = new LayoutBO();
                    BeanUtils.copyProperties(updated, response);
                    return response;
                })
                .orElse(null);
    }

    @Override
    public void deleteLayout(String layoutName) {
        layoutRepository.findByLayoutName(layoutName)
                .ifPresent(layout -> layoutRepository.deleteById(layout.getId()));
    }

    @Override
    public List<Layout> searchLayouts(String layoutName, String location) {
        return layoutRepository.searchLayouts(layoutName, location);
    }

    @Override
    public Layout saveLayout(Layout savedLayout) {
        return layoutRepository.save(savedLayout);
    }

    @Override
    public Layout getLayoutEntity(String layoutName) {
        return layoutRepository.findByLayoutName(layoutName).orElse(null);
    }

    @Override
    public Layout getLayoutById(Long layoutId) {
        return layoutRepository.findById(layoutId).orElse(null);
    }

	@Override
	public List<Layout> findByLayoutNameAndLocation(String layoutName, String location) {
		return layoutRepository.findByLayoutNameAndLocation(layoutName, location);
	}

	@Override
	public List<Layout> findByLayoutName(String layoutName) {
		return layoutRepository.findAllByLayoutName(layoutName);
	}

	@Override
	public List<Layout> findByLocation(String location) {
		return layoutRepository.findByLocation(location);
	}
	
	 @Override
	    public void updateLayoutFromBO(Layout existingLayout, LayoutBO layoutBO) {
	        // Copy all fields from BO to entity except id, pdfPath, and createdDate
	        BeanUtils.copyProperties(layoutBO, existingLayout, "id", "pdfPath", "createdDate");
	    }

	    @Override
	    public Layout updateLayoutWithNameChange(String oldLayoutName, LayoutBO layoutBO) {
	        Layout existingLayout = layoutRepository.findByLayoutName(oldLayoutName).orElse(null);
	        if (existingLayout == null) {
	            return null;
	        }
	        
	        // Now we can simply update the layout name in the same record
	        BeanUtils.copyProperties(layoutBO, existingLayout, "id", "pdfPath", "createdDate");
	        return layoutRepository.save(existingLayout);
	    }

	    // Validation method to check if layout name already exists (for updates)
	    @Override
	    public boolean isLayoutNameAvailable(String layoutName, Long excludeId) {
	        Layout existing = layoutRepository.findByLayoutName(layoutName).orElse(null);
	        if (existing == null) {
	            return true; // Name is available
	        }
	        // If we're updating the same layout, the name is still available
	        return existing.getId().equals(excludeId);
	    }

}
