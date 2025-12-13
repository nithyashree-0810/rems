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

  showRegFields: boolean = false;

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
        this.onStatusChange(); // initialize reg fields visibility
        this.loading = false;
      },
      error: () => {
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
      panNo: [this.booking.customer?.panNo || ''],

      // NEW FIELDS
      status: [this.booking.status || 'Unregistered', Validators.required],
      regDate: [this.booking.regDate || ''],
      regNo: [this.booking.regNo || '']
    });

    // Watch status change
    this.bookingForm.get('status')?.valueChanges.subscribe(() => {
      this.onStatusChange();
    });
  }

  // ---------------------------------------------------------
  // SHOW / HIDE Registered Fields
  // ---------------------------------------------------------
  onStatusChange() {
    const status = this.bookingForm.get('status')?.value;

    // show/hide status
    this.showRegFields = (status === 'Registered');

    if (this.showRegFields) {
      this.bookingForm.get('regDate')?.enable();
      this.bookingForm.get('regNo')?.enable();
    } else {
      this.bookingForm.get('regDate')?.disable();
      this.bookingForm.get('regNo')?.disable();
      this.bookingForm.patchValue({ regDate: '', regNo: '' });
    }
  }

  // ---------------------------------------------------------
  // SAVE BOOKING
  // ---------------------------------------------------------
  saveBooking(): void {
  if (this.bookingForm.invalid) {
    alert('Please fill all required fields.');
    return;
  }

  const form = this.bookingForm.getRawValue();  // IMPORTANT FIX

  const updatedBooking: Booking = {
    bookingId: this.booking.bookingId,

    layout: {
      ...this.booking.layout,
      layoutName: form.layoutName
    },

    plot: {
      plotId: this.booking.plot?.plotId ?? 0,
      plotNo: form.plotNo,
      sqft: form.sqft,
      price: form.price,
      direction: form.direction
    },

    customer: {
      ...this.booking.customer,
      firstName: form.customerName,
      mobileNo: form.mobileNo,
      address: form.address,
      pincode: form.pincode,
      aadharNo: form.aadharNo,
      panNo: form.panNo
    },

    sqft: form.sqft,
    price: form.price,
    paidAmount: form.paidAmount,
    balance: form.balance,
    direction: form.direction,
    plotNo: form.plotNo,

    status: form.status,
    regDate: form.status === 'Registered' ? form.regDate : null,
    regNo: form.status === 'Registered' ? form.regNo : null
  };

  this.bookingService.updateBooking(this.bookingId, updatedBooking).subscribe({
    next: () => {
      alert('Booking updated successfully!');
      setTimeout(() => this.router.navigate(['/booking-history']), 100);
    },
    error: () => alert('Failed to update booking!')
  });
}


  goBack(): void {
    this.router.navigate(['/booking-history']);
  }
}
