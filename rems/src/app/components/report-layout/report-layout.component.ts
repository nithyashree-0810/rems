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
  filteredData: Layout[] = [];

  currentPage = 1;
  pageSize = 10;

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadLayouts();
  }

  // Load Data
  loadLayouts() {
    this.layoutService.getLayouts().subscribe((data: Layout[]) => {
      this.allLayouts = data.sort((a, b) => {
        const dateA = new Date(a.createdDate || 0).getTime();
        const dateB = new Date(b.createdDate || 0).getTime();
        return dateB - dateA || (Number(b.id) - Number(a.id));
      });
      this.filteredData = [...this.allLayouts];
      this.currentPage = 1;
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

    this.currentPage = 1;
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
    if (this.filteredData.length === 0) {
      this.toastr.warning('No data to download');
      return;
    }

    const dataToDownload = this.filteredData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );

    this.reportService.downloadLayoutsReport(dataToDownload).subscribe({
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

