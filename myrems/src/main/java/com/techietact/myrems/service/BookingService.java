package com.techietact.myrems.service;

import java.util.List;

import com.techietact.myrems.entity.Booking;

public interface BookingService {

	Booking saveBooking(Booking booking);

	List<Booking> getAllBookings();

	Booking getBookingById(Long id);

	Booking updateBooking(Long id, Booking booking);

	void deleteBooking(Long id);

	// History-related methods
	List<Booking> getLatestActiveBookingsPerPlot();
	
	List<Booking> getAllActiveBookings();
	
	List<Booking> getBookingHistoryByPlotId(Long plotId);
	
	List<Booking> getBookingHistoryByLayoutId(Long layoutId);
	
	Booking getLatestActiveBookingByPlotId(Long plotId);
	
	boolean hasActiveBookingForPlot(Long plotId);

	// Soft delete method
	void softDeleteBooking(Long id);
	
}
