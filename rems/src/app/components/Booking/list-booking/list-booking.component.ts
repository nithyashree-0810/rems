import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { Booking } from '../../../models/bookings';
import { ToastrService } from 'ngx-toastr';
import { PlotserviceService } from '../../../services/plotservice.service';

@Component({
  selector: 'app-list-booking',
  standalone: false,
  templateUrl: './list-booking.component.html',
  styleUrls: ['./list-booking.component.css']
})
export class ListBookingComponent implements OnInit {

  searchLayoutName: string = '';
  searchPlotNo: string = '';

  bookingList: Booking[] = [];
  filteredData: Booking[] = [];
  paginatedBookings: Booking[] = [];

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  loading: boolean = true;

  // ---------- Rebook State (Ownership Change) ----------
  showRebookModal: boolean = false;
  selectedBooking: Booking | null = null;
  rebookPrice: number = 0;
  rebookPaid: number = 0;
  rebookBalance: number = 0;

  newOwnerID: string = '';
  newOwnerName: string = '';
  newOwnerMobile: string = '';
  newOwnerAddress: string = '';

  // ---------- Edit State (Payment Update) ----------
  showEditForm: boolean = false;
  editPaidAmount: number = 0;
  editBalance: number = 0;

  constructor(
    private bookingService: BookingService,
    private plotService: PlotserviceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  // ---------------- LOAD BOOKINGS ----------------

  loadBookings() {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookingList = data.sort((a, b) => a.bookingId - b.bookingId);
        this.filteredData = [...this.bookingList];
        this.currentPage = 1;
        this.applyPagination();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load bookings');
        this.loading = false;
      }
    });
  }

  // ---------------- SEARCH ----------------

  onSearch() {
    const layoutKey = this.searchLayoutName.trim().toLowerCase();
    const plotKey = this.searchPlotNo.trim().toLowerCase();

    this.filteredData = this.bookingList.filter(b => {
      const layoutName = (b.layout?.layoutName || '').toLowerCase();
      const plotNo = (b.plot?.plotNo || b.plotNo || '').toString().toLowerCase();
      return (!layoutKey || layoutName.includes(layoutKey)) &&
             (!plotKey || plotNo.includes(plotKey));
    });

    this.currentPage = 1;
    this.applyPagination();
  }

  // ---------------- PAGINATION ----------------

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

  // ---------------- NAVIGATION ----------------

  goToCreate() {
    this.router.navigate(['/new-booking']);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  // ---------------- PAYMENT HELPERS ----------------

  getTotalPaid(b: Booking): number {
    return (b.advance1 || 0) +
           (b.advance2 || 0) +
           (b.advance3 || 0) +
           (b.advance4 || 0);
  }

  getBalance(b: Booking): number {
    return (b.price || 0) - this.getTotalPaid(b);
  }

  // ================= EDIT (PAYMENT UPDATE) =================

  openEditForm(b: Booking) {
    this.selectedBooking = { ...b };

    if (!this.selectedBooking.price || this.selectedBooking.price === 0) {
      this.selectedBooking.price = b.plot?.price || 0;
    }

    this.editPaidAmount = this.getTotalPaid(b);
    this.calculateEditBalance();

    this.showEditForm = true;
    this.showRebookModal = false;
  }

  calculateEditBalance() {
    if (!this.selectedBooking) return;

    const price = this.selectedBooking.price || 0;
    const paid = this.editPaidAmount || 0;

    const balance = price - paid;
    this.editBalance = balance < 0 ? 0 : balance;
  }

  closeEditForm() {
    this.showEditForm = false;
    this.selectedBooking = null;
    this.editPaidAmount = 0;
    this.editBalance = 0;
  }

  confirmUpdatePayment() {
    if (!this.selectedBooking) return;

    const price = this.selectedBooking.price || 0;

    if (price <= 0) {
      this.toastr.error('Invalid total price');
      return;
    }

    if (this.editPaidAmount > price) {
      this.toastr.warning('Paid amount cannot exceed total price');
      this.editPaidAmount = price;
      this.calculateEditBalance();
      return;
    }

    const updateData = {
      advance1: this.editPaidAmount,
      balance: this.editBalance,
      price: price
    };

    this.bookingService.updateBooking(this.selectedBooking.bookingId, updateData).subscribe({
      next: () => {
        this.toastr.success('Payment updated successfully');
        this.closeEditForm();
        this.loadBookings();
      },
      error: () => this.toastr.error('Failed to update payment')
    });
  }

  // ================= REBOOK (OWNERSHIP TRANSFER) =================

  openRebookForm(b: Booking) {
    this.selectedBooking = b;

    this.newOwnerID = '';
    this.newOwnerName = '';
    this.newOwnerMobile = '';
    this.newOwnerAddress = '';

    this.rebookPrice = b.price || b.plot?.price || 0;
    this.rebookPaid = 0;
    this.rebookBalance = this.rebookPrice;

    const plotId = b.plot?.plotId || 0;

    if (plotId > 0) {
      this.plotService.getPlotById(plotId).subscribe({
        next: plot => {
          this.rebookPrice = plot.price || this.rebookPrice;
          this.rebookBalance = this.rebookPrice;
          this.showRebookModal = true;
          this.showEditForm = false;
        },
        error: () => {
          this.showRebookModal = true;
          this.showEditForm = false;
        }
      });
    } else {
      this.showRebookModal = true;
      this.showEditForm = false;
    }
  }

  calculateRebookBalance() {
    if (this.rebookPrice < 0) {
      this.rebookPrice = 0;
    }
    this.rebookPaid = 0;
    this.rebookBalance = this.rebookPrice;
  }

  closeRebookForm() {
    this.showRebookModal = false;
    this.selectedBooking = null;
  }

  confirmRebook() {
    if (!this.selectedBooking) return;

    if (this.rebookPrice <= 0) {
      this.toastr.error('Enter valid resale price');
      return;
    }

    if (!this.newOwnerID || !this.newOwnerName || !this.newOwnerMobile || !this.newOwnerAddress) {
      this.toastr.error('Fill all mandatory owner details');
      return;
    }

    const request: any = {
      plot: { plotId: this.selectedBooking.plot?.plotId || 0 },
      plotNo: this.selectedBooking.plot?.plotNo || this.selectedBooking.plotNo,
      layout: { layoutName: this.selectedBooking.layout?.layoutName || '' },
      customer: {
        firstName: this.newOwnerName,
        mobileNo: Number(this.newOwnerMobile),
        address: this.newOwnerAddress,
        aadharNo: this.newOwnerID
      },
      sqft: this.selectedBooking.sqft || 0,
      price: this.rebookPrice,
      direction: this.selectedBooking.direction || '',
      advance1: 0,
      balance: this.rebookPrice,
      status: 'Booked'
    };

    this.bookingService.createBooking(request).subscribe({
      next: () => {
        this.toastr.success('Ownership transferred successfully');
        this.closeRebookForm();
        this.loadBookings();
      },
      error: () => this.toastr.error('Rebooking failed')
    });
  }
}
