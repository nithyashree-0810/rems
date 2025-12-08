package com.techietact.myrems.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techietact.myrems.service.DashboardService;

@RestController
@RequestMapping("/api/layouts")
@CrossOrigin("*")
public class DashboardController {
	
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard-counts")
    public ResponseEntity<Map<String, Long>> getDashboardCounts() {
        return ResponseEntity.ok(dashboardService.getDashboardCounts());
    }

}
