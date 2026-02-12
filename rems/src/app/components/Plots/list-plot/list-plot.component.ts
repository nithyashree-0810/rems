import { Component, OnInit } from '@angular/core';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list-plot.component.html',
  styleUrls: ['./list-plot.component.css']
})
export class ListPlotComponent implements OnInit {

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
  ) { }

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


  goToPage(page: number): void {
    this.currentPage = page;
  }

  goToCreate() {
    this.router.navigate(['/new-booking']);
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

          const maxPage = Math.ceil(this.plots.length / this.pageSize) || 1;
          if (this.currentPage > maxPage) {
            this.currentPage = maxPage;
          }
        },
        error: (err: any) => {
          console.error('Delete failed ❌', err);
          this.toastr.error('Delete failed');
        }
      });
    }
  }



  // ✅ ONLY ADDED METHOD (FIX)
  bookPlot(layoutName: string, plotNo: string): void {
    this.router.navigate(
      ['/new-booking'],
      { queryParams: { layoutName, plotNo } }
    );
  }

  onBookClick(plot: any) {

    // 🔴 Already booked
    if (plot.booked) {
      alert('Already Booked');
      return; // ⛔ stop navigation
    }

    // 🟢 Not booked → old behaviour
    this.bookPlot(plot.layout.layoutName, plot.plotNo);
  }

}
