import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardServiceService } from '../../services/dashboard-service.service';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { Booking } from '../../models/bookings';
import { Enquiry } from '../../models/enquiry';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None // Required to apply background to the body tag
})
export class DashboardComponent implements OnInit {
  // Counters for the top cards
  totalLayouts: number = 0;
  totalPlots: number = 0;
  totalEnquiries: number = 0;
  totalBookings: number = 0;

  // Enquiry breakdown for the donut chart
  enquiriesNew: number = 0;
  enquiriesPending: number = 0;

  // Chart data
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
    this.dashboardService.getDashboardCounts('admin').subscribe((res: any) => {
      this.totalLayouts = res.totalLayouts || 0;
      this.totalPlots = res.totalPlots || 0;
      this.totalEnquiries = res.totalEnquiries || 0;
      this.totalBookings = res.totalBookings || 0;
    });
  }

  // --- Methods to fix "Does not exist on type DashboardComponent" errors ---

  getChartData() {
    return {
      labels: this.monthlyBookingsLabels,
      values: this.monthlyBookingsCounts,
      // Ensures a minimum scale of 8 for the Y-axis
      maxValue: Math.max(...this.monthlyBookingsCounts, 8) 
    };
  }

  // Adjusted to match the specific call in your template
  getYPosition(value: number, max: number = 8): number {
    const height = 120; // SVG internal height
    return 160 - (value / max) * height;
  }

  getChartPath(): string {
    const data = this.getChartData();
    return data.values.map((val, i) => {
      const x = 40 + (i * 104);
      const y = this.getYPosition(val, data.maxValue);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  getAreaPath(): string {
    const linePath = this.getChartPath();
    return `${linePath} L 560 160 L 40 160 Z`;
  }

  // Fixes the error for missing Y-Axis labels in the template
  getYAxisValues(): number[] {
    const data = this.getChartData();
    // Returns [0, mid-point, max] for the chart grid lines
    return [0, Math.floor(data.maxValue / 2), data.maxValue];
  }

  // Fixes the error for the Donut Chart progress
  getDonutOffset(): number {
    const circumference = 440; // 2 * pi * r(70)
    const progress = this.totalEnquiries > 0 ? (this.enquiriesNew / this.totalEnquiries) : 0;
    return circumference * (1 - progress);
  }

  goTo(type: string): void {
    const routes: any = {
      layouts: '/view-layouts',
      plots: '/view-plots',
      enquiries: '/view-enquiries',
      bookings: '/booking-history'
    };
    this.router.navigate([routes[type]]);
  }

  private loadBookingsForChart(): void {
    this.bookingService.getAllBookings().subscribe((bookings: Booking[]) => {
      // Logic to map registration dates to monthlyBookingsCounts can be added here
    });
  }

  private loadEnquiriesOverview(): void {
    this.customerService.getAllCustomers().subscribe((enquiries: Enquiry[]) => {
      this.totalEnquiries = enquiries.length;
      // Using 'any' cast to bypass missing property error on Enquiry model
      this.enquiriesNew = enquiries.filter((e: any) => e.status === 'New').length || 0;
      this.enquiriesPending = enquiries.filter((e: any) => e.status === 'Pending').length || 0;
    });
  }
}