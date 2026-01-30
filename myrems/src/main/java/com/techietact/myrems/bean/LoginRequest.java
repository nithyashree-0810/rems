package com.techietact.myrems.bean;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
