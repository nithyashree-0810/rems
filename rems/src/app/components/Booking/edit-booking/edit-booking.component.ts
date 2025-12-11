import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/bookings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-booking',
  standalone: false,
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {

  bookingId!: number;
  booking!: Booking;
  bookingForm!: FormGroup;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBooking();
  }

  loadBooking(): void {
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (data) => {
        this.booking = data;
        this.initForm();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Booking not found!');
        this.router.navigate(['/booking-history']);
      }
    });
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      layoutName: [this.booking.layout?.layoutName || '', Validators.required],
      plotNo: [this.booking.plot?.plotNo || '', Validators.required],
      customerName: [this.booking.customer?.firstName || '', Validators.required],
      mobileNo: [this.booking.customer?.mobileNo || '', Validators.required],
      sqft: [this.booking.sqft || '', Validators.required],
      price: [this.booking.price || '', Validators.required],
      paidAmount: [this.booking.paidAmount || '', Validators.required],
      balance: [this.booking.balance || '', Validators.required],
      direction: [this.booking.direction || ''],
      address: [this.booking.customer?.address || ''],
      pincode: [this.booking.customer?.pincode || ''],
      aadharNo: [this.booking.customer?.aadharNo || ''],
      panNo: [this.booking.customer?.panNo || '']
    });
  }

 saveBooking(): void {
  if (this.bookingForm.invalid) {
    alert('Please fill all required fields.');
    return;
  }

  const updatedBooking: Booking = {
    bookingId: this.booking.bookingId,

    layout: this.booking.layout
      ? { ...this.booking.layout, layoutName: this.bookingForm.value.layoutName }
      : { layoutName: this.bookingForm.value.layoutName },

    plot: this.booking.plot
      ? {
          plotId: this.booking.plot.plotId,
          plotNo: this.bookingForm.value.plotNo,
          sqft: this.bookingForm.value.sqft,
          price: this.bookingForm.value.price,
          direction: this.bookingForm.value.direction
        }
      : undefined,

    customer: this.booking.customer
      ? {
          ...this.booking.customer,
          firstName: this.bookingForm.value.customerName,
          mobileNo: this.bookingForm.value.mobileNo,
          address: this.bookingForm.value.address,
          pincode: this.bookingForm.value.pincode,
          aadharNo: this.bookingForm.value.aadharNo,
          panNo: this.bookingForm.value.panNo
        }
      : {
          firstName: this.bookingForm.value.customerName,
          mobileNo: this.bookingForm.value.mobileNo,
          address: this.bookingForm.value.address,
          pincode: this.bookingForm.value.pincode,
          aadharNo: this.bookingForm.value.aadharNo,
          panNo: this.bookingForm.value.panNo
        },

    sqft: this.bookingForm.value.sqft,
    price: this.bookingForm.value.price,
    paidAmount: this.bookingForm.value.paidAmount,
    balance: this.bookingForm.value.balance,
    direction: this.bookingForm.value.direction,
    plotNo: this.bookingForm.value.plotNo
  };

  this.bookingService.updateBooking(this.bookingId, updatedBooking).subscribe({
    next: (res) => {
      alert('Booking updated successfully!');
      // navigate after a tiny delay to ensure backend processed it
      setTimeout(() => this.router.navigate(['/booking-history']), 100);
    },
    error: (err) => {
      console.error(err);
      alert('Failed to update booking!');
    }
  });
}


  goBack(): void {
    this.router.navigate(['/booking-history']);
  }
}
