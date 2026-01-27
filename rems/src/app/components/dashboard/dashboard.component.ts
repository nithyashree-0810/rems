import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardServiceService } from '../../services/dashboard-service.service';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { Booking } from '../../models/bookings';
import { Enquiry } from '../../models/enquiry';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  totalLayouts = 0;
  totalPlots = 0;
  totalEnquiries = 0;
  totalBookings = 0;

  enquiriesNew = 0;
  enquiriesPending = 0;

  monthlyBookingsLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  monthlyBookingsCounts: number[] = [0, 0, 0, 0, 0, 0];

  constructor(
    private router: Router,
    private dashboardService: DashboardServiceService,
    private bookingService: BookingService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadBookingsForChart();
    this.loadEnquiriesOverview();
  }

  loadCounts(): void {
    this.dashboardService
      .getDashboardCounts('admin')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalLayouts = res?.totalLayouts || 0;
          this.totalPlots = res?.totalPlots || 0;
          this.totalEnquiries = res?.totalEnquiries || 0;
          this.totalBookings = res?.totalBookings || 0;
        },
        error: () => console.error('Failed to load dashboard summary')
      });
  }

  getChartData() {
    return {
      labels: this.monthlyBookingsLabels,
      values: this.monthlyBookingsCounts,
      maxValue: Math.max(...this.monthlyBookingsCounts, 8)
    };
  }

  getYPosition(value: number, max: number = 8): number {
    const height = 120;
    return 160 - (value / max) * height;
  }

  getChartPath(): string {
    const data = this.getChartData();
    return data.values
      .map((val, i) => {
        const x = 40 + i * 104;
        const y = this.getYPosition(val, data.maxValue);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }

  getAreaPath(): string {
    return `${this.getChartPath()} L 560 160 L 40 160 Z`;
  }

  getYAxisValues(): number[] {
    const m = this.getChartData().maxValue;
    return [0, Math.floor(m / 2), m];
  }

  getDonutOffset(): number {
    const circumference = 440;
    const progress =
      this.totalEnquiries > 0
        ? this.enquiriesNew / this.totalEnquiries
        : 0;
    return circumference * (1 - progress);
  }

  goTo(type: string): void {
    const routes: any = {
      layouts: '/view-layouts',
      plots: '/view-plots',
      enquiries: '/view-enquiries',
      bookings: '/booking-history',
      totalBookings:'/booking-history',
      totalEnquiries:'/view-enquiries',
      totalPlots:'/plots',
      totalLayouts:'/layouts'
    };

    this.router.navigate([routes[type]]);
  }

  private loadBookingsForChart(): void {
    this.bookingService
      .getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_: Booking[]) => {},
        error: () => console.error('Failed to load bookings chart data')
      });
  }

  private loadEnquiriesOverview(): void {
    this.customerService
      .getAllCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enquiries: Enquiry[]) => {
          this.totalEnquiries = enquiries?.length || 0;
          this.enquiriesNew =
            enquiries?.filter((e: any) => e.status === 'New').length || 0;
          this.enquiriesPending =
            enquiries?.filter((e: any) => e.status === 'Pending').length || 0;
        },
        error: () => console.error('Failed to load enquiries overview')
      });
  }

 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
