import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { PlotserviceService } from '../../../services/plotservice.service';

@Component({
  selector: 'app-create-booking',
  standalone: false,
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent {
plotList: any;
onLayoutChange() {
throw new Error('Method not implemented.');
}
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

  bookings: Booking[] = []; // store all bookings for listing
layoutList: any;

  constructor(private bookingService: BookingService,private router:Router,private plotService:PlotserviceService,
    private customerService:CustomerService) {}
  onPlotChange(): void {
  const plotno = this.booking.plotno;
  if (!plotno) return;

  this.plotService.getPlotById(plotno).subscribe({
    next: (plot) => {
      debugger
      this.booking.layoutName = plot.layout.layoutName;
      this.booking.sqft = plot.sqft;
      this.booking.direction = plot.direction;
      this.booking.price = plot.price;

      if (this.booking.paidAmount) {
        this.booking.balance = this.booking.price - this.booking.paidAmount;
      }
    },
    error: () => {
      alert('Plot not found');
      this.booking.layoutName = '';
      this.booking.sqft = 0;
      this.booking.direction = '';
      this.booking.price = 0;
    }
  });
}

onMobileChange(): void {
  const mobile = this.booking.mobileNo;
  if (!mobile) return;



  
  this.customerService.getCustomerByMobile(mobile).subscribe({
    next: (enquiry) => {
      this.booking.customerName = enquiry.firstName;
      this.booking.address = enquiry.address;
      this.booking.pincode = enquiry.pincode;
      //this.booking.aadharNo = enquiry.aadharNo;
      
    },
    error: () => {
      alert('Customer not found for this mobile number.');
      this.booking.customerName = '';
      this.booking.address = '';
      this.booking.pincode = 0;
      this.booking.aadharNo = '';
      this.booking.panNo = '';

    }
  });
}

onPaidAmountChange(): void {
  this.booking.balance = this.booking.price - (this.booking.paidAmount || 0);
}


  // CREATE
  onSubmit(form: NgForm) {
    if (form.valid) {
      debugger
       this.bookingService.createBooking(this.booking).subscribe({
         next: (res) => {
           alert('Booking Saved Successfully!');
           this.bookings.push(res);
           form.reset();
         },
         error: (err) => {
           console.error('Error:', err);
         alert('Booking Failed!');
       }
     });
    }
    this.router.navigate(['/booking-history'])
  }

  
  goHome() {
    // navigate to home page
   this.router.navigate(['/dashboard']);
  }
  
  viewBookings(){
    
  }
 



}
