import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { BookingRequest } from '../../../models/booking-request';

@Component({
  selector: 'app-create-booking',
  standalone: false,
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent implements OnInit {

  // Selected Plot Object
  selectedPlot: any = null;

  booking: Booking = {
    id: undefined,
    plotId: 0,
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
    paidAmount: 0
  };

  layoutList: any[] = [];
  plotList: any[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private plotService: PlotserviceService,
    private layoutService: LayoutserviceService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // ---------------- LOAD LAYOUTS ----------------
  loadLayouts() {
    this.layoutService.getLayouts().subscribe(data => {
      this.layoutList = data;
    });
  }

  // ---------------- WHEN LAYOUT SELECTED ----------------
  onLayoutChange(): void {
    const layoutName = this.booking.layoutName;

    if (!layoutName) {
      this.plotList = [];
      return;
    }

    this.plotService.getPlotsByLayout(layoutName).subscribe({
      next: plots => {
        this.plotList = plots.filter(p => !p.booked);
      }
    });
  }

  // ---------------- WHEN PLOT SELECTED ----------------
  onPlotChange(): void {
    if (!this.selectedPlot) return;

    const plot = this.selectedPlot;

    this.booking.plotId = plot.plotId;   // For FK
    this.booking.plotno = plot.plotNo;   // For storing plotNo
    this.booking.sqft = plot.sqft;
    this.booking.direction = plot.direction;
    this.booking.price = plot.price;

    this.onPaidAmountChange();
  }

  // ---------------- WHEN MOBILE ENTERED ----------------
  onMobileChange(): void {
    const mobile = this.booking.mobileNo;
    if (!mobile) return;

    this.customerService.getCustomerByMobile(mobile).subscribe({
      next: c => {
        this.booking.customerName = c.firstName;
        this.booking.address = c.address;
        this.booking.pincode = c.pincode;
        this.booking.aadharNo = c.aadharNo;
        this.booking.panNo = c.panNo;
      },
      error: () => alert("Customer not found!")
    });
  }

  // ---------------- CALCULATE BALANCE ----------------
  onPaidAmountChange(): void {
    this.booking.balance = this.booking.price - (this.booking.paidAmount || 0);
  }

  // ---------------- SUBMIT BOOKING ----------------
  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const requestBody: BookingRequest = {
      plot: { plotId: this.booking.plotId },
      plotNo: this.booking.plotno,
      layout: { layoutName: this.booking.layoutName },
      customer: { mobileNo: this.booking.mobileNo },

      sqft: this.booking.sqft,
      price: this.booking.price,
      paidAmount: this.booking.paidAmount,
      direction: this.booking.direction,
      balance: this.booking.balance,
      address: this.booking.address,
      pincode: this.booking.pincode,
      aadharNo: this.booking.aadharNo,
      panNo: this.booking.panNo
    };

    this.bookingService.createBooking(requestBody).subscribe({
      next: () => {
        alert("Booking Saved Successfully!");
        form.reset();
        this.router.navigate(['/booking-history']);
      },
      error: err => {
        console.error(err);
        alert("Booking Failed!");
      }
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  viewBookings() {
    this.router.navigate(['/booking-history']);
  }
}
