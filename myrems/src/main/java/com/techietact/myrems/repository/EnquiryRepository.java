package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techietact.myrems.entity.Enquiry;

@Repository
public interface EnquiryRepository  extends JpaRepository<Enquiry, Long>{

	boolean existsByMobileNo(Long mobileNo);

	boolean existsByEmail(String email);

	Optional<Enquiry> findByMobileNo(Long mobileNo);

	List<Enquiry> findAllByOrderByCreatedDateDesc();
	
	List<Enquiry> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNo(
	        String firstName, String lastName, Long mobileNo);
	
	List<Enquiry> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNoOrEmailContainingIgnoreCase(
	        String firstName, String lastName, Long mobileNo, String email);



}
