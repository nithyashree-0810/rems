import { Component } from '@angular/core';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Layout } from '../../models/layout';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-layout',
  standalone: false,
  templateUrl: './report-layout.component.html',
  styleUrl: './report-layout.component.css'
})
export class ReportLayoutComponent {
  searchName: string = "";
  searchLocation: string = "";

  allLayouts: Layout[] = [];
  layouts: Layout[] = [];
  filteredData: Layout[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
pages: number[] = [];

  noRecords: boolean = false;

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // Load Data
loadLayouts() {
  this.layoutService.getLayouts().subscribe((data: Layout[]) => {
    this.allLayouts = data;
    this.filteredData = [...data];
    this.noRecords = data.length === 0;
    this.currentPage = 1;
    this.applyPagination();
  });
}
  // Search Filter
  filterLayouts() {
  const name = this.searchName.trim().toLowerCase();
  const loc = this.searchLocation.trim().toLowerCase();

  this.filteredData = this.allLayouts.filter(layout =>
    (!name || layout.layoutName?.toLowerCase().includes(name)) &&
    (!loc || layout.location?.toLowerCase().includes(loc))
  );

  this.noRecords = this.filteredData.length === 0;
  this.currentPage = 1;
  this.applyPagination();
}

  applyPagination() {
  // 🔥 always paginate using filteredData
  this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

  // 🔥 HTML pagination buttons
  this.pages = Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;

  this.layouts = this.filteredData.slice(startIndex, endIndex);
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.applyPagination();
  }
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

  navigateToCreate() {
    this.router.navigate(['/create-layout']);
  }

  viewLayout(layoutName: string) {
    this.router.navigate(['/view-layout', layoutName]);
  }

  editLayout(layoutName: string) {
    this.router.navigate(['/edit-layout', layoutName]);
  }

  deleteLayout(layoutName: string) {
    if (confirm('Are you sure you want to delete this layout?')) {
      this.layoutService.deleteLayout(layoutName).subscribe({
        next: () => {
          this.toastr.success('Layout deleted successfully!');
          this.loadLayouts();
        },
        error: err => console.error(err)
      });
    }
  }

  viewPdf(layoutName: string) {
    const url = `http://localhost:8080/api/layouts/pdf/${layoutName}`;
    window.open(url, "_blank");
  }

  downloadLayoutsReport(): void {

  let dataToSend: Layout[] = [];

  // If search box is empty → send ALL layouts
  if (!this.searchName && !this.searchLocation) {
    dataToSend = this.allLayouts;
  }
  else {
    // User applied search → send currently filtered list
    dataToSend = this.layouts;
  }

  this.reportService.downloadLayoutsReport(dataToSend).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'layouts-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      this.toastr.success('Layouts report downloaded successfully!');
    },
    error: () => {
      this.toastr.error('Failed to download layouts report');
    }
  });
}



  goHome() {
    this.router.navigate(['/dashboard']);
  }
}

