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
      advance2: [0],
      advance3: [0],
      advance4: [0],
      balance: [{ value: 0, disabled: true }],

      direction: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      pincode: [{ value: '', disabled: true }],

      aadharNo: [''],
      panNo: [''],

      status: ['', Validators.required],
      regDate: [''],
      regNo: ['']
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
          advance2: data.advance2,
          advance3: data.advance3,
          advance4: data.advance4,
          balance: data.balance,

          direction: data.direction,
          address: data.customer?.address,
          pincode: data.customer?.pincode,

          aadharNo: data.customer?.aadharNo,
          panNo: data.customer?.panNo,

          status: data.status,
          regDate: data.regDate,
          regNo: data.regNo
        });

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
    this.showRegFields = this.bookingForm.value.status === 'Registered';
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
      advance2: raw.advance2,
      advance3: raw.advance3,
      advance4: raw.advance4,
      balance: raw.balance,

      plotNo: existing.plotNo,
      status: raw.status,
      regDate: raw.regDate,
      regNo: raw.regNo
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
