import { Component } from '@angular/core';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Router } from '@angular/router';
import { Layout } from '../../models/layout';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-layouts',
  standalone: false,
  templateUrl: './view-layouts.component.html',
  styleUrl: './view-layouts.component.css'
})
export class ViewLayoutsComponent {

  searchName: string = "";
  searchLocation: string = "";

  allLayouts: Layout[] = [];    // Full data
  layouts: Layout[] = [];       // Pagination display

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  noRecords: boolean = false;

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // 🔥 Load full list initially
  loadLayouts() {
    this.layoutService.getLayouts().subscribe((data: Layout[]) => {
      this.allLayouts = data;
      this.noRecords = data.length === 0;
      this.currentPage = 1;
      this.applyPagination();
    });
  }

  // 🔍 Search using input OR button click
  filterLayouts() {
    const name = this.searchName.trim().toLowerCase();
    const loc = this.searchLocation.trim().toLowerCase();

    // 🚨 If both empty → Load full list again
    if (name === "" && loc === "") {
      this.loadLayouts();
      return;
    }

    // 🔥 Filter logic
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

  // 📄 Normal Pagination
  applyPagination() {
    this.totalPages = Math.ceil(this.allLayouts.length / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.layouts = this.allLayouts.slice(startIndex, endIndex);
  }

  // 📄 Pagination for Search Results
  applyPaginationAfterSearch(filteredData: Layout[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.layouts = filteredData.slice(startIndex, endIndex);
  }

  // Pagination Helpers
  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  goToPage(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  // Navigation Buttons
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

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
