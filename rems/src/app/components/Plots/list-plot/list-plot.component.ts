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

  constructor(private plotService: PlotserviceService,private router:Router) {}

  ngOnInit() {
  this.plotService.getPlots().subscribe(data => {
    console.log(data);
    this.plots = data.reverse();
  
  });
}

  loadPlots(): void {
  this.plotService.getPlots().subscribe({
    next: (data: any[]) => {
      this.plots = data.reverse();
    },
    error: (err: any) => {
      console.error('Error loading plots:', err);
    }
  });
}

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
