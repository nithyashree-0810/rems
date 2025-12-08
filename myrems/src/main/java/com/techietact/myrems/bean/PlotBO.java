package com.techietact.myrems.bean;

import com.techietact.myrems.entity.Layout;

import lombok.Data;

@Data
public class PlotBO {
	
	private Long plotId;
	
	private String plotNo;
	
	private int sqft;
	
	private String direction;
	
	private double breadthOne;
	
	private double breadthTwo;
	
	private double lengthOne;
	
	private double lengthTwo;
	
	private double price;
	
	private double totalSqft;
	
	private String address;
	
	private long mobile;
	
	private String ownerName;
	
	private String email;
	
	private boolean booked;
	
	private Layout layout;
	

}



