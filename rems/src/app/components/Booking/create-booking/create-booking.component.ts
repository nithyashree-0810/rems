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
      const plotId = params['plotId'];
      const layoutId = params['layoutId'];
      const isRebooking = params['rebooking'] === 'true';
      const originalBookingId = params['originalBookingId'];

      if (isRebooking && plotId) {
        // Handle rebooking scenario
        this.handleRebooking(plotId, layoutId, originalBookingId);
      } else if (layoutName && plotNo) {
        // Handle normal booking from plot list
        this.handleNormalBooking(layoutName, plotNo);
      }
    });
  }

  handleRebooking(plotId: number, layoutId?: number, originalBookingId?: number): void {
    // Load plot details for rebooking
    this.plotService.getPlotById(plotId).subscribe({
      next: (plot) => {
        this.selectedPlot = plot;
        this.booking.layoutName = plot.layout?.layoutName || '';
        this.booking.plotId = plot.plotId;
        this.booking.plotNo = plot.plotNo;
        this.booking.sqft = plot.sqft;
        this.booking.price = plot.price;
        this.booking.direction = plot.direction;
        
        // Load plots for the layout
        if (plot.layout?.layoutName) {
          this.plotService.getPlotsByLayout(plot.layout.layoutName).subscribe(plots => {
            this.plotList = plots; // Show all plots for rebooking
          });
        }
        
        this.toastr.info('Rebooking mode: Plot details pre-filled. Please enter customer details.');
      },
      error: (err) => {
        console.error('Error loading plot for rebooking:', err);
        this.toastr.error('Failed to load plot details for rebooking');
        this.router.navigate(['/booking-history']);
      }
    });
  }

  handleNormalBooking(layoutName: string, plotNo: string): void {
    this.booking.layoutName = layoutName;

    this.plotService.getPlotsByLayout(layoutName).subscribe(plots => {
      // Filter out already booked plots for normal booking
      this.plotList = plots.filter((p: any) => !p.booked);

      const selected = this.plotList.find((p: any) => p.plotNo === plotNo);

      if (!selected) {
        this.toastr.error('This plot is already booked ❌');
        this.router.navigate(['/list-plots']);
        return;
      }

      this.selectedPlot = selected;
      this.onPlotChange();
    });
  }

  loadLayouts(): void {
    this.layoutService.getLayouts().subscribe((data: any) => {
      this.layoutList = data;
    });
  }

  onLayoutChange(): void {
    this.plotService.getPlotsByLayout(this.booking.layoutName).subscribe({
      next: (plots: any) => {
        this.plotList = plots.filter((p: any) => !p.booked);
      }
    });
  }

  onPlotChange(): void {
    if (!this.selectedPlot) return;

    const p = this.selectedPlot;
    this.booking.plotId = p.plotId;
    this.booking.plotNo = p.plotNo;
    this.booking.sqft = p.totalSqft ?? p.sqft;
    this.booking.price = p.price;
    this.booking.direction = p.direction;

    this.calculateBalance();
  }

  onMobileChange(): void {
    if (!this.booking.mobileNo) return;

    const mobileNumber = Number(this.booking.mobileNo);
    if (isNaN(mobileNumber)) {
      this.toastr.error('Invalid mobile number');
      return;
    }

    this.customerService.getCustomerByMobile(mobileNumber).subscribe({
      next: (c: any) => {
        if (c) {
          this.booking.firstName = c.firstName || '';
          this.booking.address = c.address || '';
          this.booking.pincode = c.pincode || null;
          this.booking.aadharNo = c.aadharNo || null;
          this.booking.panNo = c.panNo || '';
        } else {
          // Clear fields if customer not found
          this.booking.firstName = '';
          this.booking.address = '';
          this.booking.pincode = null;
          this.booking.aadharNo = null;
          this.booking.panNo = '';
          this.toastr.error('Customer not found');
        }
      },
      error: () => {
        // Clear fields on error
        this.booking.firstName = '';
        this.booking.address = '';
        this.booking.pincode = null;
        this.booking.aadharNo = null;
        this.booking.panNo = '';
        this.toastr.error('Customer not found');
      }
    });
  }

  calculateBalance(): void {
    const totalAdvance =
      (+this.booking.advance1 || 0) +
      (+this.booking.advance2 || 0) +
      (+this.booking.advance3 || 0) +
      (+this.booking.advance4 || 0);

    this.booking.balance = this.booking.price - totalAdvance;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const requestBody = {
      plot: { plotId: this.booking.plotId },
      plotNo: this.booking.plotNo,
      layout: { layoutName: this.booking.layoutName },
      customer: { mobileNo: Number(this.booking.mobileNo) },

      sqft: this.booking.sqft || 0,
      price: this.booking.price || 0,
      direction: this.booking.direction || '',

      advance1: this.booking.advance1 || 0,
      advance1Date: this.booking.advance1Date || null,
      advance1Mode: this.booking.advance1Mode || '',

      advance2: this.booking.advance2 || 0,
      advance2Date: this.booking.advance2Date || null,
      advance2Mode: this.booking.advance2Mode || '',

      advance3: this.booking.advance3 || 0,
      advance3Date: this.booking.advance3Date || null,
      advance3Mode: this.booking.advance3Mode || '',

      advance4: this.booking.advance4 || 0,
      advance4Date: this.booking.advance4Date || null,
      advance4Mode: this.booking.advance4Mode || '',

      balance: this.booking.balance || 0,

      address: this.booking.address || '',
      pincode: this.booking.pincode || 0,
      aadharNo: this.booking.aadharNo || null,
      panNo: this.booking.panNo || '',

      status: this.booking.status || '',
      regDate: this.booking.status === 'Registered' ? this.booking.regDate : null,
      regNo: this.booking.status === 'Registered' ? this.booking.regNo : null,

      refundAmount: this.booking.refundAmount || 0,
      mode: this.booking.mode || null
    };

    console.log('=== FRONTEND BOOKING REQUEST ===');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

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

  onMobileInput(event: any): void {
    let value = event.target.value;

    // 🔹 Numbers only
    value = value.replace(/\D/g, '');

    // 🔹 Max 10 digits only
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    this.booking.mobileNo = value;
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  viewBookings(): void {
    this.router.navigate(['/booking-history']);
  }
}