package com.techietact.myrems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "agents")
@Data
public class Agent {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "agent_name", nullable = false)
 private String agentName;

 private String mobile;

 private String email;

 private String address;

 private boolean active = true;
}


