package com.techietact.myrems.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techietact.myrems.entity.Booking;
import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.service.BookingService;
import com.techietact.myrems.service.EnquiryService;
import com.techietact.myrems.service.PlotService;

@RequestMapping("/api/booking")
@RestController
public class BookingController {
	@Autowired
	    private  BookingService bookingService;

	    @Autowired
	    private PlotService plotService;
	    @Autowired
private EnquiryService enquiryService;
	    @PostMapping
	    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
	        
	    	String plotNo=booking.getPlot().getPlotNo();
	    	 Plot plot = plotService.getByPlotNo(plotNo);
	    	 if (null ==plot) {
	    	        return ResponseEntity.badRequest().build(); 
	    	    }
	    	 	booking.setPlot(plot);
	    	 
	    	 	booking.setLayout(plot.getLayout());
	    	    booking.setDirection(plot.getDirection());
	    	    booking.setSqft(plot.getSqft());
	    	    booking.setPrice(plot.getPrice());
	    	  
	    	
	    	    Long mobileNo = booking.getCustomer().getMobileNo();
	            Enquiry customer = enquiryService.getByMobileNo(mobileNo);
	            if (customer == null) {
	                return ResponseEntity.badRequest().build(); // Invalid customer
	            }

	           
	            booking.setCustomer(customer);
	            booking.setAddress(customer.getAddress());
	            booking.setPincode(customer.getPincode());
	            booking.setAadharNo(customer.getAadharNo());
	            booking.setPanNo(customer.getPanNo());
	    	
	        double balance = booking.getPrice() - booking.getPaidAmount();
	        booking.setBalance(balance);
	        
	        Booking saved = bookingService.saveBooking(booking);

	        return ResponseEntity.created(URI.create("/api/bookings/" + saved.getBookingId()))
	                             .body(saved);
	    }

	    
	   
	    
	    @GetMapping
	    public List<Booking> getAllBookings() {
	        return bookingService.getAllBookings();
	    }

	    @GetMapping("/{id}")
	    public Booking getBookingById(@PathVariable Long id) {
	        return bookingService.getBookingById(id);
	    }

	    @PutMapping("/{id}")
	    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking booking) {
	        return bookingService.updateBooking(id, booking);
	    }

	    @DeleteMapping("/{id}")
	    public void deleteBooking(@PathVariable Long id) {
	        bookingService.deleteBooking(id);
	    }
	}

	
	


