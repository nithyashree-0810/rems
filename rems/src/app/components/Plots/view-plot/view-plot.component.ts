import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Plot } from '../../../models/plot';

@Component({
  selector: 'app-view-plot',
  standalone:false,
  templateUrl: './view-plot.component.html',
  styleUrls: ['./view-plot.component.css']
})
export class ViewPlotComponent implements OnInit {

  layoutName: string = '';
  plotNo: any;
  plot!: Plot;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.layoutName = this.route.snapshot.paramMap.get('layoutName') ?? '';
    this.plotNo = this.route.snapshot.paramMap.get('plotNo');

    if (this.layoutName && this.plotNo) {

      // ✅ Call updated backend API: /{layoutName}/{plotNo}
      this.plotService.getPlotByLayoutAndPlotNo(this.layoutName, this.plotNo)
        .subscribe({
          next: (res: Plot) => {
            this.plot = res;
            console.log("VIEW PLOT DATA:", this.plot);
          },
          error: (err) => {
            console.error("Error loading plot ❌", err);
            alert("Plot not found");
          }
        });
    }
  }

  goBack() {
    this.router.navigate(['/plots']);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
