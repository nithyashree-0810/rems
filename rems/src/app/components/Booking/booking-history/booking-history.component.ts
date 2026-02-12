import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { Booking } from '../../../models/bookings';
import { Plot } from '../../../models/plot';
import { Layout } from '../../../models/layout';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-history',
  standalone: false,
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {

  plotId?: number;
  layoutId?: number;
  historyType: 'plot' | 'layout' = 'plot';

  bookingHistory: Booking[] = [];
  filteredBookingHistory: Booking[] = [];
  plot?: Plot;
  layout?: Layout;
  selectedBooking?: Booking;

  loading: boolean = true;
  currentPage = 1;
  pageSize = 10;

  // Search and Filter properties
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private plotService: PlotserviceService,
    private layoutService: LayoutserviceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params['plotId']) {
        this.plotId = +params['plotId'];
        this.historyType = 'plot';
        this.loadPlotHistory();
      } else if (params['layoutId']) {
        this.layoutId = +params['layoutId'];
        this.historyType = 'layout';
        this.loadLayoutHistory();
      }
    });
  }

  loadPlotHistory(): void {
    if (!this.plotId) return;

    this.loading = true;

    // Load plot details
    this.plotService.getPlotById(this.plotId).subscribe({
      next: (plot: Plot) => {
        this.plot = plot;
      },
      error: (err: any) => {
        console.error('Error loading plot:', err);
        this.toastr.error('Failed to load plot details');
      }
    });

    // Load booking history for the plot
    this.bookingService.getBookingHistoryByPlot(this.plotId).subscribe({
      next: (history: Booking[]) => {
        this.bookingHistory = history;
        this.filteredBookingHistory = [...history];
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading plot booking history:', err);
        this.toastr.error('Failed to load booking history');
        this.loading = false;
      }
    });
  }

  loadLayoutHistory(): void {
    if (!this.layoutId) return;

    this.loading = true;

    // Load layout details
    this.layoutService.getLayoutById(this.layoutId).subscribe({
      next: (layout: Layout) => {
        this.layout = layout;
      },
      error: (err: any) => {
        console.error('Error loading layout:', err);
        this.toastr.error('Failed to load layout details');
      }
    });

    // Load booking history for the layout
    this.bookingService.getBookingHistoryByLayout(this.layoutId).subscribe({
      next: (history: Booking[]) => {
        this.bookingHistory = history;
        this.filteredBookingHistory = [...history];
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading layout booking history:', err);
        this.toastr.error('Failed to load booking history');
        this.loading = false;
      }
    });
  }

  // ================= SEARCH AND FILTER METHODS =================

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.bookingHistory];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customer?.firstName?.toLowerCase().includes(searchLower) ||
        booking.customer?.mobileNo?.toString().includes(searchLower) ||
        booking.bookingId?.toString().includes(searchLower) ||
        booking.aadharNo?.toString().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(booking =>
        booking.bookingStatus === this.statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          const dateA = new Date(a.createdDate || 0).getTime();
          const dateB = new Date(b.createdDate || 0).getTime();
          comparison = dateA - dateB;
          break;
        case 'customer':
          const nameA = (a.customer?.firstName || '').toLowerCase();
          const nameB = (b.customer?.firstName || '').toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'amount':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'status':
          const statusA = (a.bookingStatus || '').toLowerCase();
          const statusB = (b.bookingStatus || '').toLowerCase();
          comparison = statusA.localeCompare(statusB);
          break;
      }

      return this.sortOrder === 'desc' ? -comparison : comparison;
    });

    this.filteredBookingHistory = filtered;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.applyFilters();
  }

  getUniqueStatuses(): string[] {
    const statuses = this.bookingHistory
      .map(b => b.bookingStatus)
      .filter(s => s !== undefined && s !== null) as string[];
    return [...new Set(statuses)];
  }

  // ================= CALCULATION METHODS =================

  getTotalPaid(booking: Booking): number {
    return (booking.advance1 || 0) +
      (booking.advance2 || 0) +
      (booking.advance3 || 0) +
      (booking.advance4 || 0);
  }

  getBalance(booking: Booking): number {
    const price = booking.price || 0;
    const paid = this.getTotalPaid(booking);
    return price - paid;
  }

  getStatusClass(status?: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'status-active';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      case 'REFUNDED': return 'status-refunded';
      case 'TRANSFERRED': return 'status-transferred';
      default: return 'status-unknown';
    }
  }

  formatDate(dateString?: string | Date): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  formatDateTime(dateString?: string | Date): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN');
  }

  // ================= MODAL METHODS =================

  viewDetails(booking: Booking): void {
    console.log('Opening modal for booking:', booking);
    this.selectedBooking = booking;
  }

  closeModal(): void {
    this.selectedBooking = undefined;
  }

  rebookFromModal(): void {
    console.log('Rebook from modal clicked');
    if (this.selectedBooking) {
      this.rebookPlot(this.selectedBooking);
      this.closeModal();
    }
  }

  // ================= REBOOKING FUNCTIONALITY =================

  canRebook(booking: Booking): boolean {
    return !!booking.plotNo || !!booking.plot?.plotId;
  }


  getRebootTooltip(booking: Booking): string {
    if (!booking.plot) {
      return 'Cannot rebook - plot information not available';
    }
    return 'Click to rebook this plot with new customer details';
  }

  rebookPlot(booking: Booking): void {

    const plotId = booking.plot?.plotId || booking.plotNo;

    if (!plotId) {
      this.toastr.error('Plot ID not found for rebooking');
      return;
    }

    const confirmRebook = confirm(
      `Are you sure you want to rebook this plot?\n\nThis will create a new booking.`
    );

    if (!confirmRebook) return;

    this.router.navigate(['/new-booking'], {
      queryParams: {
        plotId: plotId,
        layoutId: booking.layout?.id || this.layoutId,
        rebooking: true,
        originalBookingId: booking.bookingId
      }
    });

    this.toastr.info('Redirecting to rebooking form...');
  }

  // ================= NAVIGATION =================

  goBack(): void {
    this.router.navigate(['/booking-history']);
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  goToBookingList(): void {
    this.router.navigate(['/booking-history']);
  }

  // ================= EXPORT FUNCTIONALITY =================

  exportToCSV(): void {
    if (this.filteredBookingHistory.length === 0) {
      this.toastr.warning('No data to export');
      return;
    }

    const headers = [
      'Booking ID',
      'Customer Name',
      'Mobile',
      'Status',
      'Total Price',
      'Total Paid',
      'Balance',
      'Address',
      'Aadhar No',
      'PAN No',
      'Booking Date',
      'Updated Date'
    ];

    if (this.historyType === 'layout') {
      headers.splice(2, 0, 'Plot No');
    }

    const csvData = this.filteredBookingHistory.map(booking => {
      const row = [
        booking.bookingId,
        booking.customer?.firstName || '',
        booking.customer?.mobileNo || '',
        booking.bookingStatus || '',
        booking.price || 0,
        this.getTotalPaid(booking),
        this.getBalance(booking),
        booking.address || '',
        booking.aadharNo || '',
        booking.panNo || '',
        this.formatDateTime(booking.createdDate),
        this.formatDateTime(booking.updatedDate)
      ];

      if (this.historyType === 'layout') {
        row.splice(2, 0, booking.plot?.plotNo || '');
      }

      return row;
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const fileName = this.historyType === 'plot'
      ? `plot-${this.plot?.plotNo}-booking-history.csv`
      : `layout-${this.layout?.layoutName}-booking-history.csv`;

    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastr.success('Booking history exported successfully');
  }

  printHistory(): void {
    window.print();
  }
}