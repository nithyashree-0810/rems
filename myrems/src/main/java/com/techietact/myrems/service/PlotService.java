package com.techietact.myrems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.bean.PlotBO;
import com.techietact.myrems.entity.Plot;

public interface PlotService {

	boolean createPlat(PlotBO plotBo);

    //List<Plot> getPlotsByLayout(String layoutName);

	//List<Plot> findAll();

	List<Plot> getAllPlots();

	Optional<Plot> get(Long id);

	Plot updateByPlotNo(String plotNo, PlotBO newPlot);

	void deleteByPlotNo(String plotNo);

	Plot getByPlotNo(String plotNo);

	List<Plot> getPlotsByLayout(String layoutName);
	
	void uploadPlotsFromExcel(MultipartFile file);
	
	Plot getByLayoutAndPlotNo(String layoutName, String plotNo);

	void deleteByLayoutNameAndPlotNo(String layoutName, String plotNo);

	Plot updateByLayoutNameAndPlotNo(String layoutName, String plotNo, PlotBO bo);
	
	Plot getPlotById(Long plotId);

	void markAsBooked(Long plotId);
	
}
