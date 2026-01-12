import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';


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
    advance1Date: null,
    advance1Mode: '',

    advance2: 0,
    advance2Date: null,
    advance2Mode: '',

    advance3: 0,
    advance3Date: null,
    advance3Mode: '',

    advance4: 0,
    advance4Date: null,
    advance4Mode: '',

    balance: 0,

    mobileNo: '',
    firstName: '',
    address: '',
    pincode: null,
    aadharNo: null,
    panNo: '',

    status: '',
    regDate: null,
    regNo: null,

    refundAmount: 0,
    mode: null
  };

  layoutList: any[] = [];
  plotList: any[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,  
    private plotService: PlotserviceService,
    private layoutService: LayoutserviceService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  this.loadLayouts();

  this.route.queryParams.subscribe(params => {
    const layoutName = params['layoutName'];
    const plotNo = params['plotNo'];

    if (layoutName && plotNo) {
      this.booking.layoutName = layoutName;

      this.plotService.getPlotsByLayout(layoutName).subscribe(plots => {

        // ❌ already booked plot-a remove pannrom
        this.plotList = plots.filter(p => !p.booked);

        const selected = this.plotList.find(p => p.plotNo === plotNo);

        if (!selected) {
          this.toastr.error('This plot is already booked ❌');
          this.router.navigate(['/list-plots']);
          return;
        }

        this.selectedPlot = selected;
        this.onPlotChange();
      });
    }
  });
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
    this.booking.sqft = p.totalSqft ?? p.sqft;
    this.booking.price = p.price;
    this.booking.direction = p.direction;

    this.calculateBalance();
  }

  onMobileChange() {
    if (!this.booking.mobileNo) return;

    this.customerService.getCustomerByMobile(this.booking.mobileNo).subscribe({
      next: c => {
        this.booking.firstName = c.firstName;
        this.booking.address = c.address;
        this.booking.pincode = c.pincode;
        this.booking.aadharNo = c.aadharNo;
        this.booking.panNo = c.panNo;
      },
      error: () => this.toastr.error('Customer not found')
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
      advance1Date: this.booking.advance1Date,
      advance1Mode: this.booking.advance1Mode,

      advance2: this.booking.advance2,
      advance2Date: this.booking.advance2Date,
      advance2Mode: this.booking.advance2Mode,

      advance3: this.booking.advance3,
      advance3Date: this.booking.advance3Date,
      advance3Mode: this.booking.advance3Mode,

      advance4: this.booking.advance4,
      advance4Date: this.booking.advance4Date,
      advance4Mode: this.booking.advance4Mode,

      balance: this.booking.balance,

      address: this.booking.address,
      pincode: this.booking.pincode,
      aadharNo: this.booking.aadharNo,
      panNo: this.booking.panNo,

      status: this.booking.status,
      regDate: this.booking.status === 'Registered' ? this.booking.regDate : null,
      regNo: this.booking.status === 'Registered' ? this.booking.regNo : null,

      refundAmount: this.booking.refundAmount,
      mode: this.booking.mode
    };

    this.bookingService.createBooking(requestBody).subscribe({
  next: () => {
    // ✅ Mark plot as booked
    this.plotService.markAsBooked(this.booking.plotId).subscribe({
      next: () => {
        this.toastr.success('Booking Saved Successfully ✅');
        this.router.navigate(['/booking-history']);
      },
      error: () => this.toastr.error('Failed to mark plot as booked')
    });
  },
  error: () => this.toastr.error('Booking Failed ❌')
});

  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  viewBookings() {
    this.router.navigate(['/booking-history']);
  }
}
