package com.techietact.myrems.bean;

import lombok.Data;

@Data
public class EnquiryBO {
	private Long mobileNo;
	private String firstName;
	private String lastName;
	private String fatherName;
	private String address;

	private int pincode;

	private String email;

	private String panNo;
	private Long aadharNo;
	private String comments;
	private String referralName;
	private String referralNumber;

}
