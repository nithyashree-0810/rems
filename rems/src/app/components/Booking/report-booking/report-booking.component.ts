import { Component } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';
import { Booking } from '../../../models/bookings';

@Component({
  selector: 'app-report-booking',
  standalone: false,
  templateUrl: './report-booking.component.html',
  styleUrl: './report-booking.component.css'
})
export class ReportBookingComponent {

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

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getFormattedAdvances(b: Booking): string[] {
    const advances: string[] = [];
    if (b.advance1 && b.advance1 > 0) advances.push(`Advance 1: ₹${b.advance1.toLocaleString('en-IN')} (${this.formatDate(b.advance1Date)})`);
    if (b.advance2 && b.advance2 > 0) advances.push(`Advance 2: ₹${b.advance2.toLocaleString('en-IN')} (${this.formatDate(b.advance2Date)})`);
    if (b.advance3 && b.advance3 > 0) advances.push(`Advance 3: ₹${b.advance3.toLocaleString('en-IN')} (${this.formatDate(b.advance3Date)})`);
    if (b.advance4 && b.advance4 > 0) advances.push(`Advance 4: ₹${b.advance4.toLocaleString('en-IN')} (${this.formatDate(b.advance4Date)})`);
    return advances;
  }

  bookingList: Booking[] = [];
  filteredData: Booking[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  // Load all bookings
  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: data => {
        this.bookingList = data.sort((a, b) => {
          const dateA = new Date(a.createdDate || 0).getTime();
          const dateB = new Date(b.createdDate || 0).getTime();
          return dateB - dateA || (Number(b.bookingId) - Number(a.bookingId));
        });
        this.filteredData = [...this.bookingList];
        this.currentPage = 1;
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
  }

  // Navigate to create booking page

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
        },
        error: () => {
          this.toastr.error('Failed to delete booking!');
        }
      });
    }
  }

  downloadBookingsReport(): void {
    const dataToSend = this.filteredData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );

    this.reportService.downloadBookingsReport(dataToSend).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings-report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastr.success('Bookings report downloaded successfully!');
      },
      error: (err: any) => {
        console.error('Failed to download bookings report', err);
        this.toastr.error('Failed to download bookings report');
      }
    });
  }


}

