import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from '../../../models/bookings';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css'],
  standalone: false
})
export class EditBookingComponent implements OnInit {

  bookingId!: number;
  bookingForm!: FormGroup;
  loading = true;
  showRegFields = false;

  // 🔥 IMPORTANT: store existing booking
  existingBooking!: Booking;
   showCancelFields = false; 

  canEditAdvance1 = false;
  canEditAdvance2 = false;
  canEditAdvance3 = false;
  canEditAdvance4 = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    // get booking id
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));

    // init form
    this.bookingForm = this.fb.group({
      layoutName: [{ value: '', disabled: true }],
      plotNo: [{ value: '', disabled: true }],
      customerName: [{ value: '', disabled: true }],
      mobileNo: [{ value: '', disabled: true }],
      sqft: [{ value: 0, disabled: true }],
      price: [{ value: 0, disabled: true }],

      advance1: [0],
  advance1Date: [''],
  advance1Mode: [''],

  advance2: [0],
  advance2Date: [''],
  advance2Mode: [''],

  advance3: [0],
  advance3Date: [''],
  advance3Mode: [''],

  advance4: [0],
  advance4Date: [''],
  advance4Mode: [''],
      balance: [{ value: 0, disabled: true }],

      direction: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      pincode: [{ value: '', disabled: true }],

      aadharNo: [''],
      panNo: [''],

      status: ['', Validators.required],
      regDate: [''],
      regNo: [''],
        refundedAmount: [{ value: 0, disabled: true }],   // already refunded
  refundNow: [0],                                   // current refund
  remainingRefund: [{ value: 0, disabled: true }], // balance - refunded
  refundDate: [''],
  refundMode: ['']
    });

    this.loadBooking();
  }

  // ---------------- LOAD BOOKING ----------------
  loadBooking() {
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (data: Booking) => {

        // 🔥 store existing booking
        this.existingBooking = data;

        this.bookingForm.patchValue({
          layoutName: data.layout?.layoutName,
          plotNo: data.plot?.plotNo,

          customerName: data.customer?.firstName,
          mobileNo: data.customer?.mobileNo,

          sqft: data.sqft,
          price: data.price,

           advance1: data.advance1,
  advance1Date: data.advance1Date,
  advance1Mode: data.advance1Mode,

  advance2: data.advance2,
  advance2Date: data.advance2Date,
  advance2Mode: data.advance2Mode,

  advance3: data.advance3,
  advance3Date: data.advance3Date,
  advance3Mode: data.advance3Mode,

  advance4: data.advance4,
  advance4Date: data.advance4Date,
  advance4Mode: data.advance4Mode,
          balance: data.balance,

          direction: data.direction,
          address: data.customer?.address,
          pincode: data.customer?.pincode,

          aadharNo: data.customer?.aadharNo,
          panNo: data.customer?.panNo,

          status: data.status,
          regDate: data.regDate,
          regNo: data.regNo,
           refundedAmount: data.refundedAmount || 0,
  remainingRefund: data.remainingRefund || data.balance,
  refundDate: data.refundDate,
  refundMode: data.refundMode
        });

        this.showCancelFields = data.status === 'Cancel';
        this.showRegFields = data.status === 'Registered';
        this.setAdvanceEditPermissions();
        this.calculateBalance();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load booking');
        this.loading = false;
      }
    });
  }

  // ---------------- ADVANCE LOCK ----------------
  setAdvanceEditPermissions() {
    const raw = this.bookingForm.getRawValue();

    this.canEditAdvance1 = raw.advance1 === 0;
    this.canEditAdvance2 = raw.advance1 > 0 && raw.advance2 === 0;
    this.canEditAdvance3 = raw.advance2 > 0 && raw.advance3 === 0;
    this.canEditAdvance4 = raw.advance3 > 0 && raw.advance4 === 0;
  }

  // ---------------- BALANCE ----------------
  calculateBalance() {
    const raw = this.bookingForm.getRawValue();

    const totalPaid =
      (raw.advance1 || 0) +
      (raw.advance2 || 0) +
      (raw.advance3 || 0) +
      (raw.advance4 || 0);

    this.bookingForm.patchValue({
      balance: raw.price - totalPaid
    });
  }

  onStatusChange() {
  const status = this.bookingForm.value.status;

  this.showRegFields = status === 'Registered';
  this.showCancelFields = status === 'Cancel';

  if (status === 'Cancel') {
    const raw = this.bookingForm.getRawValue();
    const refunded = raw.refundedAmount || 0;
    const balance = raw.balance;

    this.bookingForm.patchValue({
      remainingRefund: balance - refunded
    });
  }

  if (status !== 'Registered') {
    this.bookingForm.patchValue({
      regDate: '',
      regNo: ''
    });
  }
}
calculateRefund() {
  const raw = this.bookingForm.getRawValue();

  const balance = raw.balance;
  const alreadyRefunded = raw.refundedAmount || 0;
  const refundNow = raw.refundNow || 0;

  const totalRefunded = alreadyRefunded + refundNow;

  if (totalRefunded > balance) {
    this.toastr.error('Refund amount exceeds balance');
    this.bookingForm.patchValue({ refundNow: 0 });
    return;
  }

  this.bookingForm.patchValue({
    refundedAmount: totalRefunded,
    remainingRefund: balance - totalRefunded,
    refundNow: 0
  });
}


  // ---------------- SAVE BOOKING ----------------
  saveBooking() {
    const raw = this.bookingForm.getRawValue();
    const existing = this.existingBooking;

    const payload: Booking = {
      bookingId: existing.bookingId,

      plot: existing.plot!,
      layout: existing.layout!,
      customer: {
        ...existing.customer!,
        aadharNo: raw.aadharNo,
        panNo: raw.panNo
      },

      sqft: existing.sqft,
      price: existing.price,
      direction: existing.direction,

      advance1: raw.advance1,
advance1Date: raw.advance1Date,
advance1Mode: raw.advance1Mode,

advance2: raw.advance2,
advance2Date: raw.advance2Date,
advance2Mode: raw.advance2Mode,

advance3: raw.advance3,
advance3Date: raw.advance3Date,
advance3Mode: raw.advance3Mode,

advance4: raw.advance4,
advance4Date: raw.advance4Date,
advance4Mode: raw.advance4Mode,
      balance: raw.balance,

      plotNo: existing.plotNo,
      status: raw.status,
      regDate: raw.regDate,
      regNo: raw.regNo,
      refundedAmount: raw.refundedAmount,
    remainingRefund: raw.remainingRefund,
    refundDate: raw.refundDate,
    refundMode: raw.refundMode
    };

    this.bookingService
      .updateBooking(this.bookingId, payload)
      .subscribe(() => {
        this.toastr.success('Booking Updated Successfully');
        this.goBack();
      });
  }

  // ---------------- BACK ----------------
  goBack() {
    this.router.navigate(['/booking-history']);
  }
}
