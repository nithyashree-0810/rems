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
	//List<Enquiry> findAllByOrderByCreatedDateAsc();

	Enquiry findByMobileNo(Long mobileNo);

	List<Enquiry> findAllByOrderByCreatedDateDesc();

}
