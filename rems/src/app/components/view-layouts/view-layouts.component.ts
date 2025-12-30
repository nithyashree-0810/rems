import { Component } from '@angular/core';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Router } from '@angular/router';
import { Layout } from '../../models/layout';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-view-layouts',
  standalone: false,
  templateUrl: './view-layouts.component.html',
  styleUrls: ['./view-layouts.component.css'] // ✅ FIXED (styleUrl → styleUrls)
})
export class ViewLayoutsComponent {

  searchName: string = "";
  searchLocation: string = "";

  allLayouts: Layout[] = [];
  layouts: Layout[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

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
      this.noRecords = data.length === 0;
      this.currentPage = 1;
      this.applyPagination();
    });
  }

  // Search Filter
  filterLayouts() {
    const name = this.searchName.trim().toLowerCase();
    const loc = this.searchLocation.trim().toLowerCase();

    if (name === "" && loc === "") {
      this.loadLayouts();
      return;
    }

    const filtered = this.allLayouts.filter(layout =>
      (name === "" || layout.layoutName?.toLowerCase().includes(name)) &&
      (loc === "" || layout.location?.toLowerCase().includes(loc))
    );

    this.noRecords = filtered.length === 0;

    this.layouts = filtered;
    this.currentPage = 1;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    this.applyPaginationAfterSearch(filtered);
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.allLayouts.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.layouts = this.allLayouts.slice(startIndex, endIndex);
  }

  applyPaginationAfterSearch(filteredData: Layout[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.layouts = filteredData.slice(startIndex, endIndex);
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

  downloadLayoutsReport() {
    this.reportService.downloadLayoutsReport().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'layouts-report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download layouts report', err);
        this.toastr.error('Failed to download layouts report');
      }
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
