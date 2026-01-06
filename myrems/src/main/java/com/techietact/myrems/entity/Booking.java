package com.techietact.myrems.entity;

import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
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
    private LocalDate advance1Date;
    private String advance1Mode;

    private int advance2;
    private LocalDate advance2Date;
    private String advance2Mode;

    private int advance3;
    private LocalDate advance3Date;
    private String advance3Mode;

    private int advance4;
    private LocalDate advance4Date;
    private String advance4Mode;

    private double balance;

    private String plotNo;
    private String address;
    private int pincode;
    private Long aadharNo;
    private String panNo;

    private String status;
    private Date regDate;
    private Long regNo;
    private Long refundedAmount;     // already refunded
    private Long refundNow;          // current refund entry
    private Double remainingRefund;    // balance - refundedAmount
    private LocalDate refundDate;
    private String refundMode;

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
