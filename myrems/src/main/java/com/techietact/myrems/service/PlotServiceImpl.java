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
        if (plotRepository.existsByPlotNo(plotBo.getPlotNo())) {
            return false;
        }

        Plot plot = new Plot();
        BeanUtils.copyProperties(plotBo, plot);
        plot.setLayout(plotBo.getLayout());

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
        return true;
    }
	
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
		Plot plot = plotRepository.findByPlotNo(plotNo)
		        .orElseThrow(()-> new RuntimeException("Plot not found"));

		   plot.setOwnerName(newPlot.getOwnerName());
		   plot.setAddress(newPlot.getAddress());
		   plot.setMobile(newPlot.getMobile());
		   plot.setEmail(newPlot.getEmail());
		   plot.setSqft(newPlot.getSqft());
		   plot.setDirection(newPlot.getDirection());
		   plot.setBreadthOne(newPlot.getBreadthOne());
		   plot.setBreadthTwo(newPlot.getBreadthTwo());
		   plot.setLengthOne(newPlot.getLengthOne());
		   plot.setLengthTwo(newPlot.getLengthTwo());
		   plot.setTotalSqft(newPlot.getTotalSqft());
		   plot.setPrice(newPlot.getPrice());

		   Layout layout = layoutRepository
		           .findByLayoutName(newPlot.getLayout().getLayoutName())
		           .orElseThrow(() -> new RuntimeException("Layout not found"));

		   plot.setLayout(layout);

		   return plotRepository.save(plot);

		}
	}

	
	

	



