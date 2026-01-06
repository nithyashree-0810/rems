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

  allLayouts: Layout[] = [];        // Full data from server
  filteredLayouts: Layout[] = [];   // Filtered after search
  layouts: Layout[] = [];           // Current paginated slice

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

  // Load layouts from server
  loadLayouts() {
    this.layoutService.getLayouts().subscribe((data: Layout[]) => {
      this.allLayouts = data;
      this.filteredLayouts = [...data]; // Initially, filtered = all
      this.noRecords = data.length === 0;
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.filteredLayouts.length / this.pageSize);
      this.applyPagination();
    });
  }

  // Filter layouts by name & location
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
    this.totalPages = Math.ceil(this.filteredLayouts.length / this.pageSize);
    this.applyPagination();
  }

  // Apply pagination to the filtered list
  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.layouts = this.filteredLayouts.slice(startIndex, endIndex);
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

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
