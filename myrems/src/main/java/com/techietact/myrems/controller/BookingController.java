package com.techietact.myrems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techietact.myrems.entity.Booking;
import com.techietact.myrems.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/createbooking")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking saved = bookingService.saveBooking(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        if (booking == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Booking deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(java.util.Collections.singletonMap("message", "Could not delete booking: " + e.getMessage()));
        }
    }

    // ================= HISTORY ENDPOINTS =================

    @GetMapping("/latest-per-plot")
    public ResponseEntity<List<Booking>> getLatestActiveBookingsPerPlot() {
        return ResponseEntity.ok(bookingService.getLatestActiveBookingsPerPlot());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Booking>> getAllActiveBookings() {
        return ResponseEntity.ok(bookingService.getAllActiveBookings());
    }

    @GetMapping("/history/plot/{plotId}")
    public ResponseEntity<List<Booking>> getBookingHistoryByPlot(@PathVariable Long plotId) {
        return ResponseEntity.ok(bookingService.getBookingHistoryByPlotId(plotId));
    }

    @GetMapping("/history/layout/{layoutId}")
    public ResponseEntity<List<Booking>> getBookingHistoryByLayout(@PathVariable Long layoutId) {
        return ResponseEntity.ok(bookingService.getBookingHistoryByLayoutId(layoutId));
    }

    @GetMapping("/latest/plot/{plotId}")
    public ResponseEntity<Booking> getLatestActiveBookingByPlot(@PathVariable Long plotId) {
        Booking booking = bookingService.getLatestActiveBookingByPlotId(plotId);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/soft-delete/{id}")
    public ResponseEntity<String> softDeleteBooking(@PathVariable Long id) {
        try {
            bookingService.softDeleteBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling booking: " + e.getMessage());
        }
    }
}
