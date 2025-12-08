import { Component, OnInit } from '@angular/core';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list-plot.component.html',
  styleUrls: ['./list-plot.component.css']
})
export class ListPlotComponent implements OnInit {

  plots: any[] = [];
  searchLayoutName: string = '';
  searchMessage: string = '';

  constructor(private plotService: PlotserviceService, private router: Router) {}

  ngOnInit() {
    this.loadPlots();
  }

  // Load all plots
  loadPlots(): void {
    this.plotService.getPlots().subscribe({
      next: (data: any[]) => {
        this.plots = data.reverse();
        this.searchMessage = '';
        this.currentPage = 1;
      },
      error: (err: any) => {
        console.error('Error loading plots:', err);
        this.searchMessage = 'Error loading plots';
      }
    });
  }

  // 🔹 Search by layout name
  searchPlotsByLayout(): void {
    const trimmedLayout = this.searchLayoutName.trim();
    if (!trimmedLayout) {
      this.searchMessage = 'Please enter a layout name';
      this.loadPlots(); // Reload all plots if search is empty
      return;
    }

    this.plotService.getPlotsByLayout(trimmedLayout).subscribe({
      next: (data: any[]) => {
        this.plots = data.reverse();
        this.searchMessage = data.length === 0 ? 'No plots found for this layout' : '';
        this.currentPage = 1; // Reset pagination on search
      },
      error: (err: any) => {
        console.error('Error fetching plots by layout:', err);
        this.searchMessage = 'Error fetching plots';
      }
    });
  }

  // Pagination logic
  currentPage = 1;
  pageSize = 5;

  get totalPages(): number {
    return Math.ceil(this.plots.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // Navigation
  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  viewPlot(plot: any) {
    this.router.navigate(['/view-plot', plot.plotNo]);
  }

  editPlot(plot: any) {
    this.router.navigate(['/edit-plot', plot.plotNo]);
  }

  deletePlot(plot: any) {
    if (confirm(`Delete plot ${plot.plotNo}?`)) {
      this.plotService.deletePlotByPlotNo(plot.plotNo).subscribe(() => {
        alert('Deleted successfully ✅');
        this.loadPlots();
      });
    }
  }

  bookPlot(plot: any) {
    console.log('Booking: ', plot);
  }
}
