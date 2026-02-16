package com.techietact.myrems.service;

import com.techietact.myrems.bean.RegisterRequest;
import com.techietact.myrems.bean.ResetPasswordRequest;
import com.techietact.myrems.entity.OtpVerification;
import com.techietact.myrems.entity.UserCredential;
import com.techietact.myrems.repository.OtpVerificationRepository;
import com.techietact.myrems.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserCredential user = new UserCredential();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        emailService.sendEmail(user.getEmail(), "Registration Successful",
                "Welcome! Your account has been created successfully.");
    }

    @Transactional
    public void sendOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email not registered");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));

        // Remove existing OTP for this email if any
        otpRepository.deleteByEmail(email);

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(otpVerification);

        System.out.println("DEBUG: Generated OTP for " + email + " is: " + otp);

        emailService.sendEmail(email, "Password Reset OTP",
                "Your OTP for password reset is: " + otp + ". This OTP is valid for 10 minutes.");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        OtpVerification otpVerification = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found or expired"));

        if (!otpVerification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpVerification);
            throw new RuntimeException("OTP expired");
        }

        UserCredential user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpRepository.delete(otpVerification);

        emailService.sendEmail(user.getEmail(), "Password Reset Successful",
                "Your password has been updated successfully.");
    }

    public UserCredential login(String email, String password) {
        UserCredential user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    public UserCredential getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
