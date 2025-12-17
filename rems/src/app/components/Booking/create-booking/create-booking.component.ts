import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-create-booking',
  standalone: false,
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent implements OnInit {

  selectedPlot: any = null;

  booking: any = {
    layoutName: '',
    plotId: null,
    plotNo: '',
    sqft: 0,
    price: 0,
    direction: '',
    advance1: 0,
    advance2: 0,
    advance3: 0,
    advance4: 0,
    balance: 0,

    mobileNo: '',
    address: '',
    pincode: null,
    aadharNo: null,
    panNo: '',

    status: '',
    regDate: null,
    regNo: null
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

  loadLayouts() {
    this.layoutService.getLayouts().subscribe(data => {
      this.layoutList = data;
    });
  }

  onLayoutChange() {
    this.plotService.getPlotsByLayout(this.booking.layoutName).subscribe({
      next: plots => {
        this.plotList = plots.filter(p => !p.booked);
      }
    });
  }

  onPlotChange() {
    if (!this.selectedPlot) return;

    const p = this.selectedPlot;
    this.booking.plotId = p.plotId;
    this.booking.plotNo = p.plotNo;
    this.booking.sqft = p.sqft;
    this.booking.price = p.price;
    this.booking.direction = p.direction;

    this.calculateBalance();
  }

  onMobileChange() {
    if (!this.booking.mobileNo) return;

    this.customerService.getCustomerByMobile(this.booking.mobileNo).subscribe({
      next: c => {
        this.booking.firstName=c.firstName;
        this.booking.address = c.address;
        this.booking.pincode = c.pincode;
        this.booking.aadharNo = c.aadharNo;
        this.booking.panNo = c.panNo;
      },
      error: () => alert('Customer not found')
    });
  }

  calculateBalance() {
    const totalAdvance =
      (+this.booking.advance1 || 0) +
      (+this.booking.advance2 || 0) +
      (+this.booking.advance3 || 0) +
      (+this.booking.advance4 || 0);

    this.booking.balance = this.booking.price - totalAdvance;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const requestBody = {
      plot: { plotId: this.booking.plotId },
      plotNo: this.booking.plotNo,
      layout: { layoutName: this.booking.layoutName },
      customer: { mobileNo: this.booking.mobileNo },
      
      sqft: this.booking.sqft,
      price: this.booking.price,
      direction: this.booking.direction,

      advance1: this.booking.advance1,
      advance2: this.booking.advance2,
      advance3: this.booking.advance3,
      advance4: this.booking.advance4,
      balance: this.booking.balance,

      address: this.booking.address,
      pincode: this.booking.pincode,
      aadharNo: this.booking.aadharNo,
      panNo: this.booking.panNo,

      status: this.booking.status,
      regDate: this.booking.status === 'Registered' ? this.booking.regDate : null,
      regNo: this.booking.status === 'Registered' ? this.booking.regNo : null
    };

    this.bookingService.createBooking(requestBody).subscribe({
      next: () => {
        alert('Booking Saved Successfully');
        this.router.navigate(['/booking-history']);
      },
      error: () => alert('Booking Failed')
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  viewBookings() { 
    this.router.navigate(['/booking-history']);
   }
}
