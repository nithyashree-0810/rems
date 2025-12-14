package com.techietact.myrems.bean;

import java.util.Date;

import lombok.Data;

@Data
public class BookingBO {
	
	private Long bookingId;
	
	private String plotNo;
	
	private String layoutName;
	
	private int sqft;
	
	private int price;
	
	private String direction;
	
	private int balance;
	
	private String customerName;
	
	private long mobile;
	
	private String address;
	
	private int pincode;
	
	private int aadharNo;
	
	private String panNo;
	
	private int advance1;
	
	private int advance2;
	
	private int advance3;
	
	private int advance4;
	
	private String status;
	
    private Date regDate;
    
    private Long regNo;
}
