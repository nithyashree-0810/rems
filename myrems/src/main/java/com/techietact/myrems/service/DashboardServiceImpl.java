package com.techietact.myrems.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.repository.BookingRepository;
import com.techietact.myrems.repository.EnquiryRepository;
import com.techietact.myrems.repository.LayoutRepository;
import com.techietact.myrems.repository.PlotRepository;

@Service
public class DashboardServiceImpl implements DashboardService {
	
	 @Autowired
	    private LayoutRepository layoutRepository;

	    @Autowired
	    private PlotRepository plotRepository;

	    @Autowired
	    private EnquiryRepository enquiryRepository;

	    @Autowired
	    private BookingRepository bookingRepository;

	    @Override
	    public Map<String, Long> getDashboardCounts() {
	        Map<String, Long> counts = new HashMap<>();

	        counts.put("totalLayouts", layoutRepository.count());
	        counts.put("totalPlots", plotRepository.count());
	        counts.put("totalEnquiries", enquiryRepository.count());
	        counts.put("totalBookings", bookingRepository.count());

	        return counts;
	    }

}
