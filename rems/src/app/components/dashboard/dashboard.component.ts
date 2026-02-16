import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardServiceService } from '../../services/dashboard-service.service';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { RoleserviceServiceService } from '../../services/roleservice.service.service';
import { Booking } from '../../models/bookings';
import { Enquiry } from '../../models/enquiry';
import { Role } from '../../models/role';
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
  totalAgents = 0;
  totalOwners = 0;

  recentBookings: Booking[] = [];
  recentEnquiries: Enquiry[] = [];

  allRecentBookings: Booking[] = [];
  allRecentEnquiries: Enquiry[] = [];

  bookingFilter: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' = 'ALL';
  enquiryFilter: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' = 'ALL';

  constructor(
    public router: Router,
    private dashboardService: DashboardServiceService,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private roleService: RoleserviceServiceService
  ) { }

  ngOnInit(): void {
    this.loadCounts();
    this.loadRecentBookings();
    this.loadRecentEnquiries();
    this.loadRoleCounts();
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

  private loadRoleCounts(): void {
    this.roleService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles: Role[]) => {
          if (roles) {
            // Case-insensitive check
            this.totalAgents = roles.filter(r => r.role?.toUpperCase() === 'AGENT').length;
            this.totalOwners = roles.filter(r => r.role?.toUpperCase() === 'OWNER').length;
          }
        },
        error: () => console.error('Failed to load roles')
      });
  }

  private loadRecentBookings(): void {
    this.bookingService
      .getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings: Booking[]) => {
          // Store FULL sorted list
          this.allRecentBookings = (bookings || [])
            .sort((a, b) => (b.bookingId || 0) - (a.bookingId || 0));

          this.applyBookingFilter();
        },
        error: () => console.error('Failed to load recent bookings')
      });
  }

  private loadRecentEnquiries(): void {
    this.customerService
      .getAllCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enquiries: Enquiry[]) => {
          this.totalEnquiries = enquiries?.length || 0;

          // Store FULL sorted list
          this.allRecentEnquiries = (enquiries || [])
            .sort((a, b) => {
              const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
              const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
              return dateB - dateA;
            });

          this.applyEnquiryFilter();
        },
        error: () => console.error('Failed to load enquiries')
      });
  }

  applyBookingFilter(): void {
    let filtered = this.allRecentBookings;

    if (this.bookingFilter === 'TODAY') {
      filtered = filtered.filter(b => this.isToday(b.createdDate));
    } else if (this.bookingFilter === 'WEEK') {
      filtered = filtered.filter(b => this.isThisWeek(b.createdDate));
    } else if (this.bookingFilter === 'MONTH') {
      filtered = filtered.filter(b => this.isThisMonth(b.createdDate));
    }

    this.recentBookings = filtered.slice(0, 5);
  }

  applyEnquiryFilter(): void {
    let filtered = this.allRecentEnquiries;

    if (this.enquiryFilter === 'TODAY') {
      filtered = filtered.filter(e => this.isToday(e.createdDate));
    } else if (this.enquiryFilter === 'WEEK') {
      filtered = filtered.filter(e => this.isThisWeek(e.createdDate));
    } else if (this.enquiryFilter === 'MONTH') {
      filtered = filtered.filter(e => this.isThisMonth(e.createdDate));
    }

    this.recentEnquiries = filtered.slice(0, 5);
  }

  private isToday(dateStr?: string | Date): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isThisWeek(dateStr?: string | Date): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date(); // now

    // "This Week" = Last 7 Days rolling window
    // This is safer than calendar week for "Recent" lists
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of that day

    return date >= sevenDaysAgo;
  }

  private isThisMonth(dateStr?: string | Date): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  getRelativeTime(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;

    return date.toLocaleDateString();
  }

  getDisplayDate(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Format: Apr 22, 2026
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  goTo(type: string): void {
    const routes: any = {
      layouts: '/view-layouts',
      plots: '/view-plots',
      enquiries: '/view-enquiries',
      bookings: '/booking-history',
      totalBookings: '/booking-history',
      totalEnquiries: '/view-enquiries',
      totalPlots: '/plots',
      totalLayouts: '/layouts',
      agents: '/list-role',
      owners: '/list-role'
    };

    if (routes[type]) {
      this.router.navigate([routes[type]]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
