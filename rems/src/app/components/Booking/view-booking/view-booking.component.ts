import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/bookings';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewBookingComponent implements OnInit {
  bookingId!: number;
  booking?: Booking | null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBooking();
  }

  loadBooking(): void {
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Booking not found!');
        this.router.navigate(['/booking-history']);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
