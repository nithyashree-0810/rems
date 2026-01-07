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
	    
	    // ------- COPY CUSTOMER DETAILS INTO BOOKING SNAPSHOT -------
	    if (booking.getAddress() == null) {
	        booking.setAddress(enquiry.getAddress());
	    }
	    if (booking.getPincode() == 0) {
	        booking.setPincode(enquiry.getPincode());
	    }
	    if (booking.getAadharNo() == null) {
	        booking.setAadharNo(enquiry.getAadharNo());
	    }
	    if (booking.getPanNo() == null || booking.getPanNo().isBlank()) {
	        booking.setPanNo(enquiry.getPanNo());
	    } else {
	        // keep enquiry in sync if provided in booking request
	        if (enquiry.getPanNo() == null || !booking.getPanNo().equals(enquiry.getPanNo())) {
	            enquiry.setPanNo(booking.getPanNo());
	            enquiryRepository.save(enquiry);
	        }
	    }

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

	    Booking book = bookingRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Booking not found with id " + id));

	    // ================= BASIC DETAILS =================
	    book.setPlot(booking.getPlot());
	    book.setLayout(booking.getLayout());
	    book.setCustomer(booking.getCustomer());
	    book.setSqft(booking.getSqft());
	    book.setPrice(booking.getPrice());
	    book.setDirection(booking.getDirection());

	    // ================= ADVANCES =================
	    book.setAdvance1(booking.getAdvance1());
	    book.setAdvance1Date(booking.getAdvance1Date());
	    book.setAdvance1Mode(booking.getAdvance1Mode());

	    book.setAdvance2(booking.getAdvance2());
	    book.setAdvance2Date(booking.getAdvance2Date());
	    book.setAdvance2Mode(booking.getAdvance2Mode());

	    book.setAdvance3(booking.getAdvance3());
	    book.setAdvance3Date(booking.getAdvance3Date());
	    book.setAdvance3Mode(booking.getAdvance3Mode());

	    book.setAdvance4(booking.getAdvance4());
	    book.setAdvance4Date(booking.getAdvance4Date());
	    book.setAdvance4Mode(booking.getAdvance4Mode());

	    // ❗ Balance normal-aa irukkanum (DO NOT CHANGE for refund)
	    book.setBalance(booking.getBalance());

	    // ================= CUSTOMER SNAPSHOT =================
	    if (booking.getCustomer() != null) {
	        book.setAddress(booking.getCustomer().getAddress());
	        book.setPincode(booking.getCustomer().getPincode());
	        book.setAadharNo(booking.getCustomer().getAadharNo());
	        book.setPanNo(booking.getCustomer().getPanNo());
	    }

	    // ================= STATUS =================
	    book.setStatus(booking.getStatus());
	    book.setRegDate(booking.getRegDate());
	    book.setRegNo(booking.getRegNo());

	    // ================= CANCEL / REFUND LOGIC =================
	    if ("Cancel".equalsIgnoreCase(booking.getStatus())) {

	        double balance = book.getBalance(); // original balance
	        long refunded = book.getRefundedAmount() == null ? 0 : book.getRefundedAmount();
	        long refundNow = booking.getRefundNow() == null ? 0 : booking.getRefundNow();

	        long totalRefunded = refunded + refundNow;

	        if (totalRefunded > balance) {
	            throw new RuntimeException("Refund amount exceeds balance");
	        }

	        book.setRefundedAmount(totalRefunded);
	        book.setRemainingRefund(balance - totalRefunded);
	        book.setRefundDate(booking.getRefundDate());
	        book.setRefundMode(booking.getRefundMode());
	    }

	    return bookingRepository.save(book);
	}




	@Override
	public void deleteBooking(Long id) {
		// TODO Auto-generated method stub
		bookingRepository.deleteById(id);
	}

}
