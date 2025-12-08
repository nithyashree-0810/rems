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
	
	private String ownerName1;
	private String ownerName2;
	private String ownerName3;
	private String ownerName4;
	private String ownerName5;
	private String ownerName6;

	private boolean dtcpApproved;
	private boolean reraApproved;
	
	
	private LocalDateTime createdDate;
	
}
