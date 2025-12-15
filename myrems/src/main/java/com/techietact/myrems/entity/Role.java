package com.techietact.myrems.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="roles")
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long roleId;
	
	private String firstName;
	private String lastName;
	private String mobileNo;
	private String aadharNo;
	private String panNo;
	private String email;
	private String address;
	private String role;

}
