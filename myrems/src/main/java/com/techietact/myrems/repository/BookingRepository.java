package com.techietact.myrems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

}
