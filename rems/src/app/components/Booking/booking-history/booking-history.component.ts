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
  plot?: Plot;
  layout?: Layout;
  
  loading: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private plotService: PlotserviceService,
    private layoutService: LayoutserviceService,
    private toastr: ToastrService
  ) {}

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
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading layout booking history:', err);
        this.toastr.error('Failed to load booking history');
        this.loading = false;
      }
    });
  }

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

  goBack(): void {
    if (this.historyType === 'plot') {
      this.router.navigate(['/plots']);
    } else {
      this.router.navigate(['/layouts']);
    }
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  canRebook(booking: Booking): boolean {
    // Always allow rebooking - users can rebook any plot from history
    return !!booking.plot;
  }

  getRebootTooltip(booking: Booking): string {
    if (!booking.plot) {
      return 'Cannot rebook - plot information not available';
    }
    return 'Click to rebook this plot with new customer details';
  }

  rebookPlot(booking: Booking): void {
    if (!this.canRebook(booking)) {
      return;
    }

    if (!booking.plot) {
      this.toastr.error('Plot information not available for rebooking');
      return;
    }

    // Navigate to create booking page with pre-filled plot information
    this.router.navigate(['/new-booking'], {
      queryParams: {
        plotId: booking.plot.plotId,
        layoutId: booking.layout?.id,
        rebooking: true,
        originalBookingId: booking.bookingId
      }
    });
  }
}