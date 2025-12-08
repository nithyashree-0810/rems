package com.techietact.myrems.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="plots")
public class Plot {

	@Id

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
	
	private Long mobile;
	
	private String ownerName;
	
	private String email;
	
	private boolean booked;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "layout_name", referencedColumnName = "layoutName")

    private Layout layout;

}
