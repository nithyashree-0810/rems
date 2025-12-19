import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';

@Component({
  selector: 'app-list-booking',
    standalone: false,
  templateUrl: './list-booking.component.html',
  styleUrls: ['./list-booking.component.css']
})
export class ListBookingComponent implements OnInit {
  
getTotalPaid(b: any): number {
  return (b.advance1 || 0)
       + (b.advance2 || 0)
       + (b.advance3 || 0)
       + (b.advance4 || 0);
}

getBalance(b: any): number {
  const price = b.price || 0;
  const paid = this.getTotalPaid(b);
  return price - paid;
}


  bookingList: Booking[] = [];
  filteredData: Booking[] = [];
  paginatedBookings: Booking[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  loading: boolean = true;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  // Load all bookings
  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: data => {
        this.bookingList = data;
        this.filteredData = [...this.bookingList];
        this.currentPage = 1;
        this.applyPagination();
        this.loading = false;
      },
      error: () => {
        alert("Failed to load bookings!");
        this.loading = false;
      }
    });
  }
  
  applyPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedBookings = this.filteredData.slice(start, end);
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
    }
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  // Navigate to create booking page
  goToCreate() {
    this.router.navigate(['/new-booking']);
  }

  // Navigate to dashboard
  goHome() {
    this.router.navigate(['/dashboard']);
  }

  // ---------------------- Action Methods ----------------------

  // View Booking Details
  viewBooking(id: number) {
    // Navigate to the view booking page
    this.router.navigate(['/view-booking', id]);
  }

  // Edit Booking
  editBooking(id: number) {
    // Navigate to the edit booking page
    this.router.navigate(['/edit-booking', id]);
  }

  // Delete Booking
  deleteBooking(id: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          alert('Booking deleted successfully!');
          // Remove the deleted booking from the list without reloading
          this.bookingList = this.bookingList.filter(b => b.bookingId !== id);
          this.filteredData = [...this.bookingList];
          this.applyPagination();
        },
        error: () => {
          alert('Failed to delete booking!');
        }
      });
    }
  }
}
