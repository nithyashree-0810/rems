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
  styleUrls: ['./view-layouts.component.css']
})
export class ViewLayoutsComponent {

  searchName: string = "";
  searchLocation: string = "";

  allLayouts: Layout[] = [];
  filteredLayouts: Layout[] = [];

  currentPage = 1;
  pageSize = 10;

  noRecords: boolean = false;

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadLayouts();
  }

  // =========================
  // ✅ FIXED METHOD (ONLY ADDITION)
  // =========================
  getPdfName(pdfPath: string | null): string {
    if (!pdfPath) {
      return '';
    }
    return pdfPath.split(/[/\\]/).pop() || '';
  }
  // =========================

  loadLayouts() {
    this.layoutService.getLayouts().subscribe((data: Layout[]) => {
      this.allLayouts = data.sort((a, b) => {
        const dateA = new Date(a.createdDate || 0).getTime();
        const dateB = new Date(b.createdDate || 0).getTime();
        return dateB - dateA || (Number(b.id) - Number(a.id));
      });
      this.filteredLayouts = [...this.allLayouts];
      this.noRecords = data.length === 0;
      this.currentPage = 1;
    });
  }

  filterLayouts() {
    const name = this.searchName.trim().toLowerCase();
    const loc = this.searchLocation.trim().toLowerCase();

    if (name === "" && loc === "") {
      this.filteredLayouts = [...this.allLayouts];
    } else {
      this.filteredLayouts = this.allLayouts.filter(layout =>
        (name === "" || layout.layoutName?.toLowerCase().includes(name)) &&
        (loc === "" || layout.location?.toLowerCase().includes(loc))
      );
    }

    this.noRecords = this.filteredLayouts.length === 0;
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

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
