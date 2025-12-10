import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { Layout } from '../../../models/layout';
import { Plot } from '../../../models/plot';

@Component({
  selector: 'app-create-booking',
  standalone: false,
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent implements OnInit {

  layoutList: Layout[] = [];
  plotList: Plot[] = [];   // Plots for the selected layout

  booking: Booking = {
    plotno: '',
    layoutName: '',
    sqft: 0,
    price: 0,
    direction: '',
    balance: 0,
    customerName: '',
    mobileNo: 0,
    address: '',
    pincode: 0,
    aadharNo: '',
    panNo: '',
    paidAmount: 0,
  };

  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private plotService: PlotserviceService,
    private customerService: CustomerService,
    private layoutService: LayoutserviceService
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // LOAD ALL LAYOUTS
  loadLayouts() {
    this.layoutService.getLayouts().subscribe({
      next: (res) => { this.layoutList = res; },
      error: (err) => { console.error("Error loading layouts", err); }
    });
  }

  // WHEN LAYOUT CHANGES — LOAD PLOTS FOR THAT LAYOUT
  onLayoutChange() {
    if (!this.booking.layoutName) return;

    this.plotService.getPlotsByLayout(this.booking.layoutName).subscribe({
      next: (res) => {
        this.plotList = res;
        this.booking.plotno = "";
        this.resetPlotFields();  // clear plot info
      },
      error: () => {
        alert("Failed to load plots for selected layout");
      }
    });
  }

  // WHEN PLOT NO CHANGES — LOAD PLOT DETAILS
 onPlotChange() {
  const plotno = this.booking.plotno;
  if (!plotno) return;

  this.plotService.getPlotByPlotNo(plotno).subscribe({
    next: (plot: Plot) => {
      this.booking.sqft = plot.sqft;
      this.booking.direction = plot.direction;
      this.booking.price = plot.price;
      this.onPaidAmountChange();
    },
    error: () => {
      alert("❌ Plot not found!");
      this.resetPlotFields();
    }
  });
}


  resetPlotFields() {
    this.booking.sqft = 0;
    this.booking.direction = '';
    this.booking.price = 0;
    this.booking.balance = 0;
  }

  // WHEN MOBILE NUMBER CHANGES — LOAD CUSTOMER DETAILS
  onMobileChange() {
    const mobile = this.booking.mobileNo;
    if (!mobile) return;

    this.customerService.getCustomerByMobile(mobile).subscribe({
      next: (customer) => {
        this.booking.customerName = customer.firstName;
        this.booking.address = customer.address;
        this.booking.pincode = customer.pincode;
        this.booking.aadharNo = customer.aadharNo;
        this.booking.panNo = customer.panNo;
      },
      error: () => {
        alert("❌ Customer not found!");
        this.resetCustomerFields();
      }
    });
  }

  resetCustomerFields() {
    this.booking.customerName = '';
    this.booking.address = '';
    this.booking.pincode = 0;
    this.booking.aadharNo = '';
    this.booking.panNo = '';
  }

  // AUTO UPDATE BALANCE
  onPaidAmountChange() {
    this.booking.balance = (this.booking.price || 0) - (this.booking.paidAmount || 0);
  }

  // SUBMIT FORM
  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert("Please fill all required fields!");
      return;
    }

    this.bookingService.createBooking(this.booking).subscribe({
      next: (res) => {
        alert("✅ Booking Saved Successfully!");
        form.reset();
        this.router.navigate(['/booking-history']);
      },
      error: () => {
        alert("❌ Booking Failed!");
      }
    });
  }

  goHome() { this.router.navigate(['/dashboard']); }
  viewBookings() { this.router.navigate(['/booking-history']); }
}
