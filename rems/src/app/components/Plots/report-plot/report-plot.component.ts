import { Component } from '@angular/core';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-plot',
  standalone: false,
  templateUrl: './report-plot.component.html',
  styleUrl: './report-plot.component.css'
})
export class ReportPlotComponent {
 
  
    allPlots: any[] = [];
    plots: any[] = [];
    searchLayoutName: string = '';
    searchPlotNo: string = '';
    searchMessage: string = '';
  
    currentPage = 1;
    pageSize = 10;
  
    constructor(
      private plotService: PlotserviceService,
      private router: Router,
      private toastr: ToastrService,
      private reportService: ReportService
    ) {}
  
    ngOnInit(): void {
      this.loadPlots();
    }
  
    loadPlots(): void {
      this.plotService.getPlots().subscribe({
        next: (data: any[]) => {
          this.allPlots = data.reverse();
          this.plots = [...this.allPlots];
          this.searchMessage = '';
          this.currentPage = 1;
        },
        error: (err: any) => {
          console.error('Error loading plots:', err);
          this.searchMessage = 'Error loading plots';
        }
      });
    }
  
    filterPlots(): void {
      const nameKey = this.searchLayoutName.trim().toLowerCase();
      const plotKey = this.searchPlotNo.trim().toLowerCase();
  
      if (!nameKey && !plotKey) {
        this.plots = [...this.allPlots];
        this.searchMessage = '';
      } else {
        this.plots = this.allPlots.filter(plot => {
          const layoutName = (plot.layout?.layoutName || '').toLowerCase();
          const plotNo = (plot.plotNo || '').toLowerCase();
          return (!nameKey || layoutName.includes(nameKey)) &&
                 (!plotKey || plotNo.includes(plotKey));
        });
        this.searchMessage = this.plots.length === 0 ? 'No plots found' : '';
      }
  
      this.currentPage = 1;
    }
  
    get totalPages(): number {
      return Math.ceil(this.plots.length / this.pageSize);
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
            this.toastr.success('Deleted successfully ✅');
  
            this.allPlots = this.allPlots.filter(
              p => !(p.plotNo === plotNo && p.layout?.layoutName === layoutName)
            );
            this.plots = this.plots.filter(
              p => !(p.plotNo === plotNo && p.layout?.layoutName === layoutName)
            );
          },
          error: (err: any) => {
            console.error('Delete failed ❌', err);
            this.toastr.error('Delete failed');
          }
        });
      }
    }
  
    downloadPlotsReport(): void {

  const dataToDownload =
    this.searchLayoutName || this.searchPlotNo
      ? this.plots        // filtered plots
      : this.allPlots;    // all plots

  this.reportService.downloadPlotsReport(dataToDownload).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plots-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err: any) => {
      console.error('Failed to download plots report', err);
      this.toastr.error('Failed to download plots report');
    }
  });
}
  
    // ✅ ONLY ADDED METHOD (FIX)
    bookPlot(layoutName: string, plotNo: string): void {
      this.router.navigate(['/book-plot', layoutName, plotNo]);
    }
  }
  

