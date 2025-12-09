import { Component } from '@angular/core';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Router } from '@angular/router';
import { Layout } from '../../models/layout';

@Component({
  selector: 'app-view-layouts',
  standalone: false,
  templateUrl: './view-layouts.component.html',
  styleUrl: './view-layouts.component.css'
})
export class ViewLayoutsComponent {

  allLayouts: Layout[] = [];   // 🔥 Full data store
  layouts: Layout[] = [];      // 🔥 Pagination display

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  searchName: string = "";
  searchLocation: string = "";

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // 🔥 Load full list
  loadLayouts() {
    this.layoutService.getLayouts().subscribe((data: Layout[]) => {
      this.allLayouts = data;
      this.applyPagination();
    });
  }
search(): void {

  // 1. Both fields empty → load full list
  if (
    (!this.searchName || this.searchName.trim() === '') &&
    (!this.searchLocation || this.searchLocation.trim() === '')
  ) {
    this.loadLayouts();   // your existing list load function
    return;
  }

  // 2. At least one field has value → perform search
  this.layoutService.searchLayouts(this.searchName, this.searchLocation)
    .subscribe(
      (response: Layout[]) => {

        // If API returns empty → show "No records"
        if (!response || response.length === 0) {
          this.allLayouts = [];
          this.currentPage = 1;
          this.applyPagination();
          return;
        }

        // Otherwise show results
        this.allLayouts = response;
        this.currentPage = 1;
        this.applyPagination();
      },
      () => {
        // ERROR → show no records message
        this.allLayouts = [];
        this.applyPagination();
      }
    );
}


 

  // 📄 Pagination Logic
  applyPagination() {
    this.totalPages = Math.ceil(this.allLayouts.length / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.layouts = this.allLayouts.slice(startIndex, endIndex);
  }

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

  navigateToCreate() {
    this.router.navigate(['/create-layout']);
  }

  viewLayout(layoutName: string) {
    this.router.navigate(['/view-layout', layoutName]);
  }

  editLayout(layoutName: string) {
    this.router.navigate(['/edit-layout', layoutName]);
  }

  createPlot(layoutName: string) {
    this.router.navigate(['/create-plot', layoutName]);
  }

  deleteLayout(layoutName: string) {
    if (confirm('Are you sure you want to delete this layout?')) {
      this.layoutService.deleteLayout(layoutName).subscribe({
        next: () => {
          alert('Layout deleted successfully!');
          this.loadLayouts();  // refresh list
        },
        error: err => console.error(err)
      });
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
