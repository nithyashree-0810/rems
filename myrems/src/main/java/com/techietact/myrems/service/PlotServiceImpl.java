package com.techietact.myrems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.bean.PlotBO;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.repository.LayoutRepository;
import com.techietact.myrems.repository.PlotRepository;

@Service
public class PlotServiceImpl implements PlotService {

	@Autowired
	private PlotRepository plotRepository;
	
	@Autowired
    private LayoutRepository layoutRepository;

	@Override
    public boolean createPlat(PlotBO plotBo) {
		 // Step 1 → Find layout object
	    Layout layout = layoutRepository.getByLayoutName(plotBo.getLayout().getLayoutName())
	            .orElseThrow(() -> new RuntimeException("Layout not found"));

	    // Step 2 → Check unique condition: plotNo + layoutName
	    boolean exists = plotRepository.existsByPlotNoAndLayout_LayoutName(
	            plotBo.getPlotNo(),
	            layout.getLayoutName()
	    );

	    if (exists) {
	        return false; // Plot already exists in same layout
	    }

	    // Step 3 → Create new plot
	    Plot plot = new Plot();
	    BeanUtils.copyProperties(plotBo, plot);
	    plot.setLayout(layout);

	    // Step 4 → Calculate area
	    double area = 0.0;
	    if (plotBo.getTotalSqft() > 0) {
	        area = plotBo.getTotalSqft();
	    } else if (plotBo.getBreadthOne() > 0 && plotBo.getBreadthTwo() > 0 &&
	            plotBo.getLengthOne() > 0 && plotBo.getLengthTwo() > 0) {

	        double avgBreadth = (plotBo.getBreadthOne() + plotBo.getBreadthTwo()) / 2;
	        double avgLength = (plotBo.getLengthOne() + plotBo.getLengthTwo()) / 2;
	        area = avgBreadth * avgLength;
	        plot.setTotalSqft(area);
	    }

	    plot.setPrice(plotBo.getSqft() * area);

	    plotRepository.save(plot);
	    return true;    }
	
//	@Override
//	 public List<Plot> getPlotsByLayout(String layoutName) {
//	        return plotRepository.findByLayout_LayoutName(layoutName);
//	    }
//	

	@Override
    public List<Plot> getAllPlots() {
        return plotRepository.findAll();
    }

	public Plot getByPlotNo(String plotNo){
	    return plotRepository.findByPlotNo(plotNo)
	        .orElseThrow(()-> new RuntimeException("Plot not found"));
	}

	   


	public void deleteByPlotNo(String plotNo) {
	    Plot plot = plotRepository.findByPlotNo(plotNo)
	        .orElseThrow(() -> new RuntimeException("Plot not found"));

	    plotRepository.delete(plot);
	}

	@Override
	public Optional<Plot> get(Long id) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public Plot updateByPlotNo(String plotNo, PlotBO newPlot) {
		// TODO Auto-generated method stub
		 Plot existing = plotRepository.findByPlotNo(plotNo)
		            .orElseThrow(() -> new RuntimeException("Plot not found"));

		    Layout layout = layoutRepository.getByLayoutName(newPlot.getLayout().getLayoutName())
		            .orElseThrow(() -> new RuntimeException("Layout not found"));

		    // Duplicate check
		    boolean exists = plotRepository.existsByPlotNoAndLayout_LayoutName(
		            newPlot.getPlotNo(),
		            layout.getLayoutName()
		    );

		    if (exists && !existing.getPlotId().equals(newPlot.getPlotId())) {
		        throw new RuntimeException("Plot already exists in this layout");
		    }

		    BeanUtils.copyProperties(newPlot, existing);
		    existing.setLayout(layout);

		    return plotRepository.save(existing);
		}

	@Override
	public List<Plot> getPlotsByLayout(String layoutName) {
		   return plotRepository.findByLayout_LayoutName(layoutName);
	}
	}

	
	

	



