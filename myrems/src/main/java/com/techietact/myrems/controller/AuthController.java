package com.techietact.myrems.controller;

import com.techietact.myrems.bean.LoginRequest;
import com.techietact.myrems.bean.OtpRequest;
import com.techietact.myrems.bean.RegisterRequest;
import com.techietact.myrems.bean.ResetPasswordRequest;
import com.techietact.myrems.entity.UserCredential;
import com.techietact.myrems.helper.JwtUtil;
import com.techietact.myrems.service.AuthService;
import com.techietact.myrems.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            UserCredential user = authService.getUserByEmail(request.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", jwt,
                    "email", user.getEmail(),
                    "fullName", user.getFullName()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(Map.of("message", "Registration successful. Email sent."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        try {
            authService.sendOtp(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
