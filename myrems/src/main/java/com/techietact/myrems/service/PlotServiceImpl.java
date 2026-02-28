package com.techietact.myrems.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.techietact.myrems.bean.PlotBO;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.helper.ExcelHelper;
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
	    Layout layout = layoutRepository.findByLayoutName(plotBo.getLayout().getLayoutName())
	            .orElseThrow(() -> new RuntimeException("Layout not found"));

	    // Step 2 → Check plot number range and unique condition
	    int pNo;
	    try {
	        pNo = Integer.parseInt(plotBo.getPlotNo());
	    } catch (NumberFormatException e) {
	        throw new RuntimeException("Invalid plot number format.");
	    }

	    if (pNo < 1) {
	        throw new RuntimeException("Invalid plot number.");
	    }
	    if (pNo > layout.getNoOfPlots()) {
	        throw new RuntimeException("Plot number exceeds the allowed limit for this layout.");
	    }

	    boolean exists = plotRepository.existsByPlotNoAndLayout_LayoutName(
	            plotBo.getPlotNo(),
	            layout.getLayoutName()
	    );

	    if (exists) {
	        throw new RuntimeException("The plot already exists.");
	    }

	    // Step 2.1 → Count plots in layout
	    long plotCount = plotRepository.countByLayout_Id(layout.getId());
	    if (plotCount >= layout.getNoOfPlots()) {
	        throw new RuntimeException("The plot limit is reached.");
	    }

	    if (plotBo.getMobile() != 0) {
	        Optional<Plot> existing = plotRepository.findByMobile(plotBo.getMobile());
	        if (existing.isPresent()) {
	            Plot p = existing.get();
	            throw new RuntimeException("This mobile number already exists under the name: " + p.getOwnerName());
	        }
	    }

	    // Step 3 → Create new plot
	    Plot plot = new Plot();
	    BeanUtils.copyProperties(plotBo, plot);
	    plot.setLayout(layout);
	    plot.setLayoutAddress(layout.getAddress());

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

		    Layout layout = layoutRepository.findByLayoutName(newPlot.getLayout().getLayoutName())
		            .orElseThrow(() -> new RuntimeException("Layout not found"));

		    // Range check
		    int pNo;
		    try {
		        pNo = Integer.parseInt(newPlot.getPlotNo());
		    } catch (NumberFormatException e) {
		        throw new RuntimeException("Invalid plot number format.");
		    }

		    if (pNo < 1) {
		        throw new RuntimeException("Invalid plot number.");
		    }
		    if (pNo > layout.getNoOfPlots()) {
		        throw new RuntimeException("Plot number exceeds the allowed limit for this layout.");
		    }

		    // Duplicate check
		    boolean exists = plotRepository.existsByPlotNoAndLayout_LayoutName(
		            newPlot.getPlotNo(),
		            layout.getLayoutName()
		    );

		    if (exists && !existing.getPlotId().equals(newPlot.getPlotId())) {
		        throw new RuntimeException("The plot already exists.");
		    }

		    BeanUtils.copyProperties(newPlot, existing);
		    existing.setLayout(layout);
		    existing.setLayoutAddress(layout.getAddress());

		    return plotRepository.save(existing);
		}

	@Override
	public List<Plot> getPlotsByLayout(String layoutName) {
		   return plotRepository.findByLayout_LayoutName(layoutName);
	}

	@Override
	public void uploadPlotsFromExcel(MultipartFile file) {
		try {
			List<Plot> plots = ExcelHelper.convertExcelToPlots(file.getInputStream(), layoutRepository);


			// Validate Bulk Upload
			for (Plot p : plots) {
				Layout l = p.getLayout();
				
				// 0. Range check
				int pNo;
				try {
					pNo = Integer.parseInt(p.getPlotNo());
				} catch (NumberFormatException e) {
					throw new RuntimeException("Invalid plot number format for Plot No: " + p.getPlotNo());
				}

				if (pNo < 1) {
					throw new RuntimeException("Invalid plot number: " + p.getPlotNo());
				}
				if (pNo > l.getNoOfPlots()) {
					throw new RuntimeException("Plot number " + p.getPlotNo() + " exceeds the allowed limit for layout " + l.getLayoutName());
				}

				// 1. Check if plot number already exists in DB for this layout
				boolean existsInDb = plotRepository.existsByPlotNoAndLayout_LayoutName(p.getPlotNo(), l.getLayoutName());
				if (existsInDb) {
					throw new RuntimeException("Plot number " + p.getPlotNo() + " already exists in layout " + l.getLayoutName());
				}

				// 2. Check for duplicates within the Excel itself
				long duplicateInExcel = plots.stream()
						.filter(item -> item.getPlotNo().equals(p.getPlotNo()) && item.getLayout().getLayoutName().equals(l.getLayoutName()))
						.count();
				if (duplicateInExcel > 1) {
					throw new RuntimeException("Duplicate plot number " + p.getPlotNo() + " found in Excel for layout " + l.getLayoutName());
				}

				// 3. Check layout limit
				long currentCount = plotRepository.countByLayout_Id(l.getId());
				if (currentCount >= l.getNoOfPlots()) {
					throw new RuntimeException("Layout " + l.getLayoutName() + " (The plot limit is reached.)");
				}
				
				// 4. Check if adding these plots will exceed the limit
				long incomingCount = plots.stream()
						.filter(item -> item.getLayout().getId().equals(l.getId()))
						.count();
				if (currentCount + incomingCount > l.getNoOfPlots()) {
					throw new RuntimeException("Adding " + incomingCount + " plots will exceed the limit of " + l.getNoOfPlots() + " (The plot limit is reached.) for layout " + l.getLayoutName());
				}
			}

			plotRepository.saveAll(plots);
			} catch (IOException e) {
			throw new RuntimeException("Failed to store excel data: " + e.getMessage());
			}
			}
	
	@Override
	public Plot getByLayoutAndPlotNo(String layoutName, String plotNo) {
	    return plotRepository.findByLayout_LayoutNameAndPlotNo(layoutName, plotNo)
	            .orElseThrow(() -> new RuntimeException("Plot not found"));
	}
	
	@Override
	public void deleteByLayoutNameAndPlotNo(String layoutName, String plotNo) {
	    Plot plot = plotRepository.findByLayout_LayoutNameAndPlotNo(layoutName, plotNo)
	            .orElseThrow(() -> new RuntimeException("Plot not found"));

	    plotRepository.delete(plot);
	}
	
	@Override
	public Plot updateByLayoutNameAndPlotNo(String layoutName, String plotNo, PlotBO bo) {

	    Plot existing = plotRepository.findByLayout_LayoutNameAndPlotNo(layoutName, plotNo)
	            .orElseThrow(() -> new RuntimeException("Plot not found"));

	    Layout layout = layoutRepository.findByLayoutName(bo.getLayout().getLayoutName())
	            .orElseThrow(() -> new RuntimeException("Layout not found"));

	    // Range check
	    int pNo;
	    try {
	        pNo = Integer.parseInt(bo.getPlotNo());
	    } catch (NumberFormatException e) {
	        throw new RuntimeException("Invalid plot number format.");
	    }

	    if (pNo < 1) {
	        throw new RuntimeException("Invalid plot number.");
	    }
	    if (pNo > layout.getNoOfPlots()) {
	        throw new RuntimeException("Plot number exceeds the allowed limit for this layout.");
	    }

	    // Duplicate check
	    boolean exists = plotRepository.existsByPlotNoAndLayout_LayoutName(
	            bo.getPlotNo(),
	            layout.getLayoutName()
	    );

	    if (exists && !existing.getPlotId().equals(bo.getPlotId())) {
	        throw new RuntimeException("The plot already exists.");
	    }

	    BeanUtils.copyProperties(bo, existing);
	    existing.setLayout(layout);
	    existing.setLayoutAddress(layout.getAddress());

	    return plotRepository.save(existing);
	}
	
	@Override
	public Plot getPlotById(Long plotId) {
	    return plotRepository.findById(plotId)
	            .orElseThrow(() -> new RuntimeException("Plot not found"));
	}


	@Override
    public void markAsBooked(Long plotId) {

        Plot plot = plotRepository.findById(plotId)
                .orElseThrow(() -> new RuntimeException("Plot not found"));

        plot.setBooked(true);   // ✅ IMPORTANT
        plotRepository.save(plot);
    }

	@Override
	public String getExistingMobileName(Long mobile) {
		return plotRepository.findByMobile(mobile)
				.map(Plot::getOwnerName)
				.orElse("");
	}
}
	

	
	

	



