package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		""")
		List<Booking> findAllWithDetails();

	// Get only active bookings (for main list view)
	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		    WHERE b.isActive = true
		    ORDER BY b.createdDate DESC
		""")
	List<Booking> findAllActiveBookingsWithDetails();

	// Get latest booking for each plot (for list view showing only current bookings)
	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot p
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		    WHERE b.isActive = true 
		    AND b.createdDate = (
		        SELECT MAX(b2.createdDate) 
		        FROM Booking b2 
		        WHERE b2.plot.plotId = p.plotId 
		        AND b2.isActive = true
		    )
		    ORDER BY b.createdDate DESC
		""")
	List<Booking> findLatestActiveBookingsPerPlot();

	// Get all bookings for a specific plot (for history view)
	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		    WHERE b.plot.plotId = :plotId
		    ORDER BY b.createdDate DESC
		""")
	List<Booking> findAllBookingsByPlotId(@Param("plotId") Long plotId);

	// Get all bookings for a specific layout (for layout history)
	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		    WHERE b.layout.id = :layoutId
		    ORDER BY b.createdDate DESC
		""")
	List<Booking> findAllBookingsByLayoutId(@Param("layoutId") Long layoutId);

	// Get latest active booking for a specific plot
	@Query("""
		    SELECT b FROM Booking b
		    JOIN FETCH b.plot
		    JOIN FETCH b.layout
		    JOIN FETCH b.customer
		    WHERE b.plot.plotId = :plotId 
		    AND b.isActive = true
		    ORDER BY b.createdDate DESC
		    LIMIT 1
		""")
	Optional<Booking> findLatestActiveBookingByPlotId(@Param("plotId") Long plotId);

	// Check if plot has any active bookings
	@Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.plot.plotId = :plotId AND b.isActive = true")
	boolean hasActiveBookingForPlot(@Param("plotId") Long plotId);

}
