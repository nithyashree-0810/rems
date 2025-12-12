package com.techietact.myrems.bean;

import lombok.Data;

@Data
public class AgentBo {

 private Long id;
 
 private String agentName;
 
 private String email;
 
 private String mobile;
 
 private String address;
 
 private Boolean active = true;

 // Constructors
 public AgentBo() {}
 public AgentBo(String agentName, String email, String mobile, String address) {
     this.agentName = agentName;
     this.email = email;
     this.mobile = mobile;
     this.address = address;
     this.active = true;
 }
}
