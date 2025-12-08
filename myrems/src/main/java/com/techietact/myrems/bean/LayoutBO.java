package com.techietact.myrems.bean;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LayoutBO {
	
	
	
	private String layoutName;
	
	private int area;
	
	private int noOfPlots;
	
	private long phone;
	
	private String location;
	
	private String address;
	
	private int pincode;
	
	private String ownerName;
	
	private LocalDateTime createdDate;
	
}
