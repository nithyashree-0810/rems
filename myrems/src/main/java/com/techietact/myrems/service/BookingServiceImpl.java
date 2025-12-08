package com.techietact.myrems.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.entity.Booking;
import com.techietact.myrems.repository.BookingRepository;

@Service
public class BookingServiceImpl implements BookingService {
@Autowired
private BookingRepository bookingRepository;
	@Override
	public Booking saveBooking(Booking booking) {
		// TODO Auto-generated method stub
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
