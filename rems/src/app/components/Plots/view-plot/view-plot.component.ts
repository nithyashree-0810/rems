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

  plotNo: any;
  plot!: Plot;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.plotNo = this.route.snapshot.paramMap.get('plotNo');

    if (this.plotNo) {
      this.plotService.getPlotByPlotNo(this.plotNo).subscribe((res: any) => {
        this.plot = res;
        console.log("VIEW PLOT DATA :", this.plot);
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
