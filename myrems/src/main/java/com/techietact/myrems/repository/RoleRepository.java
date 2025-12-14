package com.techietact.myrems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techietact.myrems.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	boolean existsByMobileNo(String mobileNo);

	boolean existsByEmail(String email);
	
	Optional<Role> findByRoleId(Long roleId);
	
	List<Role> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNo(
	        String firstName,
	        String lastName,
	        String mobileNo
	);

}
