package com.techietact.myrems.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techietact.myrems.entity.Role;
import com.techietact.myrems.repository.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	RoleRepository repository;
	@Override
	public Role create(Role role) {
		// TODO Auto-generated method stub
		if (repository.existsByMobileNo(role.getMobileNo())) {
	        throw new RuntimeException("Mobile number already exists!");
	    }
	    if (role.getEmail() != null && !role.getEmail().trim().isEmpty()) {
	        if (repository.existsByEmail(role.getEmail())) {
	            throw new RuntimeException("Email already exists!");
	        }
	    }

	    return repository.save(role);
	}

	@Override
	public List<Role> getAll() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}
	
	public boolean mobileExists(String mobileNo) {
	    return repository.existsByMobileNo(mobileNo);
	}

	public boolean emailExists(String email) {
	    return repository.existsByEmail(email);
	}

	@Override
	public Role update(Long roleId, Role role) {
		// TODO Auto-generated method stub
		Role roles = repository.findById(roleId).orElse(null);
	    if (roles == null) {
	        throw new RuntimeException("Role not found with id " + roleId);
	    }

	    roles.setFirstName(role.getFirstName());
	    roles.setLastName(role.getLastName());
	    roles.setMobileNo(role.getMobileNo());
	    roles.setEmail(role.getEmail());
        roles.setAadharNo(role.getAadharNo());
        roles.setPanNo(role.getPanNo());
        if (role.getRole() != null && !role.getRole().isEmpty()) {
            roles.setRole(role.getRole()); // already comma separated string
        }
    roles.setAddress(role.getAddress());
    roles.setProfileImagePath(role.getProfileImagePath());
        
    return repository.save(roles);
}
    
	@Override
	public Role getByRoleId(Long roleId) {
	    return repository.findByRoleId(roleId)
	            .orElseThrow(() -> new RuntimeException("Role not found with id " + roleId));
	}

	@Override
	public void delete(Long roleId) {
		// TODO Auto-generated method stub
		repository.deleteById(roleId);
	}
	@Override
	public List<Role> search(String keyword) {

	    String mobileNo = null;

	    // keyword mobile number aa irundha
	    if (keyword != null && keyword.matches("\\d+")) {
	        mobileNo = keyword;
	    }

	    return repository
	        .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileNo(
	            keyword,
	            keyword,
	            mobileNo
	        );
	}


}
