package com.techietact.myrems.bean;

import java.time.LocalDate;
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
	    private LocalDate advance1Date;
	    private String advance1Mode;

	    private int advance2;
	    private LocalDate advance2Date;
	    private String advance2Mode;

	    private int advance3;
	    private LocalDate advance3Date;
	    private String advance3Mode;

	    private int advance4;
	    private LocalDate advance4Date;
	    private String advance4Mode;
	
	private String status;
	
    private Date regDate;
    
    private Long regNo;
    
    private Long refundAmount;
    
    private String mode;
    
}
