import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { BookingService } from '../../services/booking.service';
import { LayoutserviceService } from '../../services/layoutservice.service';

@Component({
  selector: 'app-layout-report',
  standalone: false,
  templateUrl: './layout-report.component.html',
  styleUrls: ['./layout-report.component.css']
})
export class LayoutReportComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  layouts: any[] = [];
  bookings: any[] = [];

  totalLayouts = 0;
  totalCustomersBought = 0;
  percentSold = 0;

  newLayouts = 0;
  activeLayouts = 0;
  inactiveLayouts = 0;

  topLayouts: any[] = [];

  constructor(
    private layoutService: LayoutserviceService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadLayoutReport();
  }

  // ================= LOAD LAYOUT DATA =================
  loadLayoutReport() {
    this.layoutService.getLayouts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (layouts: any[]) => {
          this.layouts = layouts || [];
          this.totalLayouts = this.layouts.length;

          this.newLayouts = this.layouts.filter(l => l.status === 'NEW').length;
          this.activeLayouts = this.layouts.filter(l => l.status === 'ACTIVE').length;
          this.inactiveLayouts = this.layouts.filter(l => l.status === 'INACTIVE').length;

          this.loadBookings();
        },
        error: () => console.error('Failed to load layouts')
      });
  }

  // ================= LOAD BOOKING DATA =================
  loadBookings() {
    this.bookingService.getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings: any[]) => {
          this.bookings = bookings || [];

          const uniqueCustomers = new Set(
            this.bookings.map(b => b.customerMobile)
          );

          this.totalCustomersBought = uniqueCustomers.size;

          this.percentSold =
            this.totalLayouts > 0
              ? Math.round((this.bookings.length / this.totalLayouts) * 100)
              : 0;

          this.calculateTopLayouts();
        },
        error: () => console.error('Failed to load bookings')
      });
  }

  // ================= TOP SELLING LAYOUTS =================
  calculateTopLayouts() {
    const map: any = {};

    this.bookings.forEach(b => {
      const name =
        b.layoutName ||
        b.layout?.layoutName ||
        b.layout?.name ||
        b.layoutname ||
        b.layout_title ||
        'Unknown';

      if (!name) return;

      map[name] = (map[name] || 0) + 1;
    });

    this.topLayouts = Object.entries(map)
      .map(([layoutName, sold]: any) => ({
        layoutName,
        sold
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
