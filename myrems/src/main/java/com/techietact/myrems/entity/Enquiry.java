package com.techietact.myrems.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="enquiries")
public class Enquiry {
	
	
@Id
@Column(unique = true, nullable = false)
	private Long mobileNo;
	private String firstName;
	
	private String lastName;
	
	
	private String address;
	
	private int pincode;
	
	private String email;
	@Column(nullable = true)
	private Long aadharNo;

	
	@Column(name = "created_date", columnDefinition = "DATETIME")
	private LocalDateTime createdDate;


}
