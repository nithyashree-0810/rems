package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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

import com.techietact.myrems.bean.LayoutBO;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.service.LayoutService;

@RestController
@RequestMapping("/api/layouts")
@CrossOrigin("*") 
public class LayoutController {
	
	@Autowired
	private LayoutService layoutService;
	
	@PostMapping("/create")
	public ResponseEntity<Layout> createLayout(@RequestBody LayoutBO layoutBO) {
        return ResponseEntity.ok(layoutService.createLayout(layoutBO));
    }
	
	@GetMapping
	public List<Layout> getAllLayouts() {
	    return layoutService.findAllLayoutsAsc();
	}

	
	@GetMapping("/{layoutName}")
    public LayoutBO getLayout(@PathVariable String layoutName) {
        return layoutService.getLayoutByLayoutName(layoutName); // if not found → null
    }
	
	@PutMapping("/{layoutName}")
    public LayoutBO updateLayout(@PathVariable String layoutName, @RequestBody LayoutBO layoutBO) {
        return layoutService.updateLayout(layoutName, layoutBO); // returns updated object
    }

    @DeleteMapping("/{layoutName}")
    public void deleteLayout(@PathVariable String layoutName) {
        layoutService.deleteLayout(layoutName); // returns nothing
    }

}
