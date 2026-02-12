package com.techietact.myrems.service;

import java.util.List;

import com.techietact.myrems.entity.Enquiry;
import com.techietact.myrems.entity.Role;

public interface RoleService {

	Role create(Role role);

	List<Role> getAll();
	
	boolean emailExists(String email);

	boolean mobileExists(String mobileNo);
	
	Role update(Long roleId,Role role);
	
	Role getByRoleId(Long roleId);
	
	void delete(Long roleId);
	
	List<Role> search(String keyword);

	String getExistingMobileName(String mobileNo);
}
