package com.techietact.myrems.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="layouts")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Layout {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String layoutName;

	private int area;
	private int noOfPlots;
	private long phone;
	private String location;
	private String address;
	private String surveyNo;
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

	// ⭐ Stores uploaded PDF physical path
	private String pdfPath;

	@OneToMany(mappedBy = "layout", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Plot> plots;

}
