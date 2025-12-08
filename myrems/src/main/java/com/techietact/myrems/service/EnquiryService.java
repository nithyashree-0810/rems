package com.techietact.myrems.service;


import java.util.List;

import com.techietact.myrems.entity.Enquiry;

public interface EnquiryService {

	Object create(Enquiry enquiry);

	List<Enquiry> getAll();

	//Enquiry getById(Long mobileNo);

	Object update(Long mobileNo, Enquiry enquiry);

	void delete(Long mobileNo);

	boolean emailExists(String email);

	boolean mobileExists(Long mobileNo);

	//Enquiry getCustomerByMobile(Long mobileNo);

	Enquiry getByMobileNo(Long mobileNo);


	

	
}
