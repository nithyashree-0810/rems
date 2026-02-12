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

	@org.springframework.data.jpa.repository.Query("SELECT e FROM Enquiry e WHERE " +
			"(:layoutLocation IS NULL OR :layoutLocation = '' OR LOWER(e.layoutLocation) LIKE LOWER(CONCAT('%', :layoutLocation, '%'))) AND " +
			"(:referralName IS NULL OR :referralName = '' OR LOWER(e.referralName) LIKE LOWER(CONCAT('%', :referralName, '%'))) AND " +
			"(:layoutName IS NULL OR :layoutName = '' OR LOWER(e.layoutName) LIKE LOWER(CONCAT('%', :layoutName, '%'))) AND " +
			"(:firstName IS NULL OR :firstName = '' OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
			"(:mobileNo IS NULL OR :mobileNo = '' OR CAST(e.mobileNo AS string) LIKE CONCAT('%', :mobileNo, '%')) AND " +
			"(:address IS NULL OR :address = '' OR LOWER(e.address) LIKE LOWER(CONCAT('%', :address, '%')))")
	List<Enquiry> advancedSearch(
			@org.springframework.data.repository.query.Param("layoutLocation") String layoutLocation,
			@org.springframework.data.repository.query.Param("referralName") String referralName,
			@org.springframework.data.repository.query.Param("layoutName") String layoutName,
			@org.springframework.data.repository.query.Param("firstName") String firstName,
			@org.springframework.data.repository.query.Param("mobileNo") String mobileNo,
			@org.springframework.data.repository.query.Param("address") String address);



}
