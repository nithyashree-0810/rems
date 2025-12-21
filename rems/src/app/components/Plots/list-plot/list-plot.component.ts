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
bookPlot(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}

  allPlots: any[] = [];   // Full list from backend
  plots: any[] = [];      // Filtered/displayed list
  searchLayoutName: string = '';
  searchPlotNo: string = '';
  searchMessage: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  constructor(private plotService: PlotserviceService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlots();
  }

  // Load all plots from backend
  loadPlots(): void {
    this.plotService.getPlots().subscribe({
      next: (data: any[]) => {
        this.allPlots = data.reverse();  // full list
        this.plots = [...this.allPlots]; // currently displayed
        this.searchMessage = '';
        this.currentPage = 1;
      },
      error: (err: any) => {
        console.error('Error loading plots:', err);
        this.searchMessage = 'Error loading plots';
      }
    });
  }

  // Live filter plots by layout name
  filterPlots(): void {
    const nameKey = this.searchLayoutName.trim().toLowerCase();
    const plotKey = this.searchPlotNo.trim().toLowerCase();

    if (!nameKey && !plotKey) {
      this.plots = [...this.allPlots]; // restore full list
      this.searchMessage = '';
    } else {
      this.plots = this.allPlots.filter(plot => {
        const layoutName = (plot.layout?.layoutName || '').toLowerCase();
        const plotNo = (plot.plotNo || '').toLowerCase();
        const matchesName = !nameKey || layoutName.includes(nameKey);
        const matchesPlot = !plotKey || plotNo.includes(plotKey);
        return matchesName && matchesPlot;
      });
      this.searchMessage = this.plots.length === 0 ? 'No plots found' : '';
    }

    this.currentPage = 1; // reset pagination
  }

  // Pagination helpers
  get totalPages(): number {
    return Math.ceil(this.plots.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  // Navigation
  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  viewPlot(layoutName: string, plotNo: string): void {
  this.router.navigate(['/view-plot', layoutName, plotNo]);
}

  editPlot(layoutName: string, plotNo: string): void {
  this.router.navigate(['/edit-plot', layoutName, plotNo]);
}

  deletePlot(layoutName: string, plotNo: string): void {
  if (confirm(`Delete plot ${plotNo} in layout ${layoutName}?`)) {
    this.plotService.deletePlot(layoutName, plotNo).subscribe({
      next: () => {
        alert("Deleted successfully ✅");

        // Remove from UI list
        this.allPlots = this.allPlots.filter(
          p => !(p.plotNo === plotNo && p.layout?.layoutName === layoutName)
        );

        this.plots = this.plots.filter(
          p => !(p.plotNo === plotNo && p.layout?.layoutName === layoutName)
        );

        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (err) => {
        console.error("Delete failed ❌", err);
        alert("Delete failed");
      }
    });
  }
}
}
