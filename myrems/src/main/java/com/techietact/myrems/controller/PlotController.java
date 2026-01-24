package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.bean.PlotBO;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.service.PlotService;



@RestController
@RequestMapping("/api/plots")
@CrossOrigin("*")
public class PlotController {
	
	@Autowired
	private PlotService plotService;
	
	@PostMapping("/create")
    public ResponseEntity<?> createPlot(@RequestBody PlotBO plotBo) {
        try {
            boolean isSaved = plotService.createPlat(plotBo);
            if (isSaved) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(" Plot created successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(" Plot already exists!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(" Error while saving: " + e.getMessage());
        }
    }
	
//	@GetMapping("/{layoutName}")
//    public ResponseEntity<List<Plot>> getPlotsByLayout(@PathVariable String layoutName) {
//        return ResponseEntity.ok(plotService.getPlotsByLayout(layoutName));
//    }

	@GetMapping
    public ResponseEntity<List<Plot>> getAllPlots() {
        List<Plot> plots = plotService.getAllPlots();
        if (plots.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(plots);
    }
	
	@GetMapping("/{layoutName}/{plotNo}")
	public ResponseEntity<Plot> getPlot(
	        @PathVariable String layoutName,
	        @PathVariable String plotNo) {

	    return ResponseEntity.ok(plotService.getByLayoutAndPlotNo(layoutName, plotNo));
	}


	
	@PutMapping("/{layoutName}/{plotNo}")
	public ResponseEntity<Plot> updatePlot(
	        @PathVariable String layoutName,
	        @PathVariable String plotNo,
	        @RequestBody PlotBO bo) {

	    return ResponseEntity.ok(
	            plotService.updateByLayoutNameAndPlotNo(layoutName, plotNo, bo)
	    );
	}


	@DeleteMapping("/delete/{layoutName}/{plotNo}")
	public ResponseEntity<String> deletePlot(
	        @PathVariable String layoutName,
	        @PathVariable String plotNo) {

	    plotService.deleteByLayoutNameAndPlotNo(layoutName, plotNo);
	    return ResponseEntity.ok("Deleted Successfully");
	}


	@GetMapping("/search/{layoutName}")
	public ResponseEntity<List<Plot>> getPlotsByLayout(@PathVariable String layoutName) {
	    List<Plot> plots = plotService.getPlotsByLayout(layoutName);
	    if (plots.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }
	    return ResponseEntity.ok(plots);
	}
	
	@PostMapping("/upload")
	public ResponseEntity<String> uploadPlots(@RequestParam("file") MultipartFile file) {
	plotService.uploadPlotsFromExcel(file);
	return ResponseEntity.ok("Excel uploaded successfully!");
	}
	
	@GetMapping("/id/{plotId}")
	public ResponseEntity<Plot> getPlotById(@PathVariable Long plotId) {
	    Plot plot = plotService.getPlotById(plotId);
	    return ResponseEntity.ok(plot);
	}
    
	 @PutMapping("/mark-booked/{plotId}")
	    public ResponseEntity<String> markPlotAsBooked(@PathVariable Long plotId) {

	        plotService.markAsBooked(plotId);
	        return ResponseEntity.ok("Plot marked as booked");
	    }

}
