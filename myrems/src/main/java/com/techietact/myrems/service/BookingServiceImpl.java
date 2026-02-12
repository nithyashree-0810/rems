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
@jakarta.transaction.Transactional
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
		try {
			System.out.println("=== BOOKING CREATION DEBUG ===");
			System.out.println("Booking object: " + booking);

			// ------- FETCH REAL PLOT -------
			System.out.println("Checking plot...");
			if (booking.getPlot() == null || booking.getPlot().getPlotId() == null) {
				throw new RuntimeException("Plot ID is required");
			}
			Plot plot = plotRepository.findById(booking.getPlot().getPlotId())
					.orElseThrow(() -> new RuntimeException("Plot not found"));

			// ✅ REMOVED: Plot booking restriction - Allow multiple bookings per plot
			System.out.println("Plot found: " + plot.getPlotNo());

			// ------- FETCH REAL LAYOUT -------
			System.out.println("Checking layout...");
			Layout layout = null;
			if (booking.getLayout() != null) {
				if (booking.getLayout().getId() != null) {
					// If ID is provided, use it
					layout = layoutRepository.findById(booking.getLayout().getId())
							.orElseThrow(() -> new RuntimeException("Layout not found"));
				} else if (booking.getLayout().getLayoutName() != null) {
					// If layoutName is provided, use it
					layout = layoutRepository.findByLayoutName(booking.getLayout().getLayoutName())
							.orElseThrow(() -> new RuntimeException("Layout not found"));
				} else {
					throw new RuntimeException("Layout ID or Layout Name is required");
				}
			} else {
				throw new RuntimeException("Layout is required");
			}
			System.out.println("Layout found: " + layout.getLayoutName());

			// ------- FETCH REAL CUSTOMER -------
			System.out.println("Checking customer...");
			if (booking.getCustomer() == null || booking.getCustomer().getMobileNo() == null) {
				throw new RuntimeException("Customer Mobile No is required");
			}
			Enquiry enquiry = enquiryRepository.findByMobileNo(booking.getCustomer().getMobileNo()).orElse(null);
			if (enquiry == null) {
				throw new RuntimeException("Customer not found");
			}
			System.out.println("Customer found: " + enquiry.getFirstName());

			// ------- SET REAL ENTITIES -------
			System.out.println("Setting entities...");
			booking.setPlot(plot);
			booking.setLayout(layout);
			booking.setCustomer(enquiry);

			// Set default status if not provided
			if (booking.getBookingStatus() == null) {
				booking.setBookingStatus(Booking.BookingStatus.ACTIVE);
			}

			// ------- COPY CUSTOMER DETAILS INTO BOOKING SNAPSHOT -------
			System.out.println("Copying customer details...");
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

			// ✅ UPDATED: Only mark plot as booked if this is an ACTIVE booking
			if (booking.getBookingStatus() == Booking.BookingStatus.ACTIVE) {
				System.out.println("Marking plot as booked...");
				plot.setBooked(true);
				plotRepository.save(plot);
			}

			// ------- SAVE BOOKING -------
			System.out.println("Saving booking...");
			Booking savedBooking = bookingRepository.save(booking);
			System.out.println("Booking saved successfully with ID: " + savedBooking.getBookingId());

			return savedBooking;

		} catch (Exception e) {
			System.err.println("Error in saveBooking: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}
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
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Booking not found with id " + id));

		boolean wasActive = booking.isActive() &&
				(booking.getBookingStatus() == Booking.BookingStatus.ACTIVE);

		// Record plot info before deleting booking
		Plot plot = booking.getPlot();

		// Delete the booking record
		bookingRepository.delete(booking);
		bookingRepository.flush(); // Ensure deletion is processed

		// If the deleted booking was active, check if plot should be marked as
		// available
		if (wasActive && plot != null) {
			if (!hasActiveBookingForPlot(plot.getPlotId())) {
				plot.setBooked(false);
				plotRepository.save(plot);
			}
		}
	}

	// ================= HISTORY METHODS =================

	@Override
	public List<Booking> getLatestActiveBookingsPerPlot() {
		return bookingRepository.findLatestActiveBookingsPerPlot();
	}

	@Override
	public List<Booking> getAllActiveBookings() {
		return bookingRepository.findAllActiveBookingsWithDetails();
	}

	@Override
	public List<Booking> getBookingHistoryByPlotId(Long plotId) {
		return bookingRepository.findAllBookingsByPlotId(plotId);
	}

	@Override
	public List<Booking> getBookingHistoryByLayoutId(Long layoutId) {
		return bookingRepository.findAllBookingsByLayoutId(layoutId);
	}

	@Override
	public Booking getLatestActiveBookingByPlotId(Long plotId) {
		return bookingRepository.findLatestActiveBookingByPlotId(plotId).orElse(null);
	}

	@Override
	public boolean hasActiveBookingForPlot(Long plotId) {
		return bookingRepository.hasActiveBookingForPlot(plotId);
	}

	@Override
	public void softDeleteBooking(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Booking not found with id " + id));

		booking.setActive(false);
		booking.setBookingStatus(Booking.BookingStatus.CANCELLED);

		// If this was the latest active booking, mark plot as available
		if (!hasActiveBookingForPlot(booking.getPlot().getPlotId())) {
			Plot plot = booking.getPlot();
			plot.setBooked(false);
			plotRepository.save(plot);
		}

		bookingRepository.save(booking);
	}

}
