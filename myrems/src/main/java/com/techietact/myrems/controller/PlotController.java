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
import org.springframework.web.bind.annotation.RestController;

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
	
	@GetMapping("/{plotNo}")
	public ResponseEntity<Plot> getByPlotNo(@PathVariable String plotNo) {
	    Plot plot = plotService.getByPlotNo(plotNo);

	    if (plot == null) {
	        return ResponseEntity.notFound().build();
	    }

	    return ResponseEntity.ok(plot);
	}

	
	@PutMapping("/{plotNo}")
	public ResponseEntity<Plot> update(@PathVariable String plotNo, @RequestBody PlotBO bo) {
	try {
	Plot updated = plotService.updateByPlotNo(plotNo, bo);
	return ResponseEntity.ok(updated);
	} catch (IllegalArgumentException ex) {
	return ResponseEntity.notFound().build();
	}
	}


	@DeleteMapping("/{plotNo}")
	public ResponseEntity<String> deleteByPlotNo(@PathVariable String plotNo) {
	    plotService.deleteByPlotNo(plotNo);
	    return ResponseEntity.ok("Plot deleted successfully");
	}

}
