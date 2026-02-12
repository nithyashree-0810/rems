package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techietact.myrems.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	boolean existsByMobileNo(String mobileNo);

	Optional<Role> findByMobileNo(String mobileNo);

	boolean existsByEmail(String email);
	
	Optional<Role> findByRoleId(Long roleId);
	
	List<Role> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNo(
	        String firstName,
	        String lastName,
	        String mobileNo
	);
	
	List<Role> findByRoleIgnoreCase(String role);
 
	@org.springframework.data.jpa.repository.Query("SELECT r FROM Role r WHERE " +
			"(:firstName IS NULL OR :firstName = '' OR LOWER(r.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
			"(:lastName IS NULL OR :lastName = '' OR LOWER(r.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
			"(:mobileNo IS NULL OR :mobileNo = '' OR r.mobileNo LIKE CONCAT('%', :mobileNo, '%')) AND " +
			"(:address IS NULL OR :address = '' OR LOWER(r.address) LIKE LOWER(CONCAT('%', :address, '%'))) AND " +
			"(:referralName IS NULL OR :referralName = '' OR LOWER(r.referralName) LIKE LOWER(CONCAT('%', :referralName, '%')))")
	List<Role> advancedSearch(
			@org.springframework.data.repository.query.Param("firstName") String firstName,
			@org.springframework.data.repository.query.Param("lastName") String lastName,
			@org.springframework.data.repository.query.Param("mobileNo") String mobileNo,
			@org.springframework.data.repository.query.Param("address") String address,
			@org.springframework.data.repository.query.Param("referralName") String referralName);


}
