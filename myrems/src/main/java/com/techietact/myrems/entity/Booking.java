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

	    // ✅ Mapping with Plot
	    @ManyToOne
	    @JoinColumn(name = "plotNo", referencedColumnName = "plotNo")
	    private Plot plot;

	    // ✅ Mapping with Layout
	    @ManyToOne
	    @JoinColumn(name = "layoutName", referencedColumnName = "layoutName")
	    private Layout layout;

	    // ✅ Mapping with Customer
	    @ManyToOne
	    @JoinColumn(name = "mobileNo", referencedColumnName = "mobileNo")
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

	    // auto-calculate balance
	    public void setPrice(double d) {
	        this.price = d;
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
