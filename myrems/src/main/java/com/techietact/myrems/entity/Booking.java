package com.techietact.myrems.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    // ✅ Mapping with Plot (using plotId as FK)
    @ManyToOne
    @JoinColumn(name = "plot_id", referencedColumnName = "plotId")
    private Plot plot;

    // ✅ Mapping with Layout (assuming layoutName is primary key in Layout)
    @ManyToOne
    @JoinColumn(name = "layout_name", referencedColumnName = "layoutName")
    private Layout layout;

    // ✅ Mapping with Customer
    @ManyToOne
    @JoinColumn(name = "mobile_no", referencedColumnName = "mobileNo")
    private Enquiry customer;

    private int sqft;
    private double price;
    private String direction;
    private double balance;
    private String address;
    private int pincode;
    private Long aadharNo;
    private String panNo;
    private int paidAmount;
    private String plotNo;


    // auto-calculate balance
    public void setPrice(double price) {
        this.price = price;
        updateBalance();
    }

    public void setPaidAmount(int paidAmount) {
        this.paidAmount = paidAmount;
        updateBalance();
    }

    private void updateBalance() {
        if (this.price > 0) {
            this.balance = this.price - this.paidAmount;
        }
    }
}
