package com.techietact.myrems.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "plot_id", referencedColumnName = "plotId")
    private Plot plot;

    @ManyToOne
    @JoinColumn(name = "layout_name", referencedColumnName = "layoutName")
    private Layout layout;

    @ManyToOne
    @JoinColumn(name = "mobile_no", referencedColumnName = "mobileNo")
    private Enquiry customer;

    private int sqft;
    private double price;
    private String direction;

    // 🔹 PAYMENTS
    private int advance1;
    private int advance2;
    private int advance3;
    private int advance4;

    private double balance;

    private String plotNo;
    private String address;
    private int pincode;
    private Long aadharNo;
    private String panNo;

    private String status;
    private Date regDate;
    private Long regNo;
    private Long refundAmount;
    private String mode;

    // 🔥 AUTO BALANCE CALCULATION
    @PrePersist
    @PreUpdate
    public void calculateBalance() {
        int totalPaid =
                advance1 +
                advance2 +
                advance3 +
                advance4;

        this.balance = this.price - totalPaid;
    }
}
