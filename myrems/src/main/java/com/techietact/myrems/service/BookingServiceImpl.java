package com.techietact.myrems.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.entity.Booking;
import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.repository.BookingRepository;
import com.techietact.myrems.repository.EnquiryRepository;
import com.techietact.myrems.repository.LayoutRepository;
import com.techietact.myrems.repository.PlotRepository;

@Service
public class BookingServiceImpl implements BookingService {
@Autowired
private BookingRepository bookingRepository;

@Autowired
private PlotRepository plotRepository;

@Autowired
private LayoutRepository layoutRepository;

@Autowired
private EnquiryRepository enquiryRepository;
	@Override
	public Booking saveBooking(Booking booking) {

	    // ------- FETCH REAL PLOT -------
	    if (booking.getPlot() == null || booking.getPlot().getPlotId() == null) {
	        throw new RuntimeException("Plot ID is required");
	    }
	    Plot plot = plotRepository.findById(booking.getPlot().getPlotId())
	            .orElseThrow(() -> new RuntimeException("Plot not found"));

	    if (plot.isBooked()) {
	        throw new RuntimeException("Plot already booked");
	    }

	    // ------- FETCH REAL LAYOUT -------
	    if (booking.getLayout() == null || booking.getLayout().getLayoutName() == null) {
	        throw new RuntimeException("Layout Name is required");
	    }
	    Layout layout = layoutRepository.findById(booking.getLayout().getLayoutName())
	            .orElseThrow(() -> new RuntimeException("Layout not found"));

	    // ------- FETCH REAL CUSTOMER -------
	    if (booking.getCustomer() == null || booking.getCustomer().getMobileNo() == null) {
	        throw new RuntimeException("Customer Mobile No is required");
	    }
	    Enquiry enquiry = enquiryRepository.findByMobileNo(booking.getCustomer().getMobileNo());
	    if (enquiry == null) {
	        throw new RuntimeException("Customer not found");
	    }

	    // ------- SET REAL ENTITIES -------
	    booking.setPlot(plot);
	    booking.setLayout(layout);
	    booking.setCustomer(enquiry);

	    // ------- MARK PLOT AS BOOKED -------
	    plot.setBooked(true);
	    plotRepository.save(plot);

	    // ------- SAVE BOOKING -------
	    return bookingRepository.save(booking);
	}

	@Override
	public List<Booking> getAllBookings() {
		// TODO Auto-generated method stub
		return bookingRepository.findAll();
	}

	@Override
	public Booking getBookingById(Long id) {
		// TODO Auto-generated method stub
		 return bookingRepository.findById(id).orElse(null);
	}

	@Override
	public Booking updateBooking(Long id, Booking booking) {
		 Booking book= bookingRepository.findById(id).orElse(null);
	        if (book != null) {
	            book.setPlot(booking.getPlot());
	            book.setLayout(booking.getLayout());
	            book.setCustomer(booking.getCustomer());
	            book.setSqft(booking.getSqft());
	            book.setPrice(booking.getPrice());
	            book.setPaidAmount(booking.getPaidAmount());
	            book.setDirection(booking.getDirection());
	            book.setAddress(booking.getAddress());
	            book.setPincode(booking.getPincode());
	            book.setAadharNo(booking.getAadharNo());
	            book.setPanNo(booking.getPanNo());
	        }
	        return bookingRepository.save(book);
	}

	@Override
	public void deleteBooking(Long id) {
		// TODO Auto-generated method stub
		bookingRepository.deleteById(id);
	}

}
