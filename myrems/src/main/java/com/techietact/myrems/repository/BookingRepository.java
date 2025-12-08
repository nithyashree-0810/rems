package com.techietact.myrems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	

}
