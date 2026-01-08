import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-list-booking',
    standalone: false,
  templateUrl: './list-booking.component.html',
  styleUrls: ['./list-booking.component.css']
})
export class ListBookingComponent implements OnInit {
  searchLayoutName: string = '';
  searchPlotNo: string = '';
  
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
  pages: number[] = [];
  loading: boolean = true;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
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
        this.toastr.error("Failed to load bookings!");
        this.loading = false;
      }
    });
  }
  
  onSearch() {
    const layoutKey = this.searchLayoutName.trim().toLowerCase();
    const plotKey = this.searchPlotNo.trim().toLowerCase();

    this.filteredData = this.bookingList.filter(b => {
      const layoutName = (b.layout?.layoutName || '').toLowerCase();
      const plotNo = ((b.plot?.plotNo as any) || (b.plotNo as any) || '').toString().toLowerCase();
      const matchesLayout = !layoutKey || layoutName.includes(layoutKey);
      const matchesPlot = !plotKey || plotNo.includes(plotKey);
      return matchesLayout && matchesPlot;
    });

    this.currentPage = 1;
    this.applyPagination();
  }
  
  applyPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
          this.toastr.success('Booking deleted successfully!');
          // Remove the deleted booking from the list without reloading
          this.bookingList = this.bookingList.filter(b => b.bookingId !== id);
          this.filteredData = [...this.bookingList];
          this.applyPagination();
        },
        error: () => {
          this.toastr.error('Failed to delete booking!');
        }
      });
    }
  }
}
