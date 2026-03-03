import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-plot',
  standalone: false,
  templateUrl: './edit-plot.component.html',
  styleUrls: ['./edit-plot.component.css']
})
export class EditPlotComponent implements OnInit {

  layoutName: string = '';
  plotNo: string = '';
  plot: any = {};
  layouts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotserviceService,
    private router: Router,
    private layoutService: LayoutserviceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    // ✅ Read new route params
    this.layoutName = this.route.snapshot.paramMap.get('layoutName') ?? '';
    this.plotNo = this.route.snapshot.paramMap.get('plotNo') ?? '';

    console.log("EDIT PARAMS →", this.layoutName, this.plotNo);

    // ❗ Load selected plot
    this.plotService.getPlotByLayoutAndPlotNo(this.layoutName, this.plotNo)
      .subscribe({
        next: (res) => {
          this.plot = res;
          console.log("EDIT PLOT DATA:", this.plot);
        },
        error: () => this.toastr.error("Plot not found")
      });

    // Load layouts for dropdown
    this.layoutService.getLayouts().subscribe(res => {
      this.layouts = res;
    });
  }

  updatePlot() {

    console.log("UPDATING PLOT:", this.plot);

    // ✅ Updated API: update by layoutName + plotNo
    this.plotService.updatePlotByLayoutAndPlotNo(this.layoutName, this.plotNo, this.plot)
      .subscribe({
        next: () => {
          this.toastr.success('Plot updated successfully');
          this.router.navigate(['/plots']);
        },
        error: (error) => {
          console.error(error);
          const errorMsg = error.error || 'Update failed';
          this.toastr.error(errorMsg);
        }
      });
  }

  calculateValues(): void {

    const b1 = Number(this.plot.breadthOne) || 0;
    const b2 = Number(this.plot.breadthTwo) || 0;
    const l1 = Number(this.plot.lengthOne) || 0;
    const l2 = Number(this.plot.lengthTwo) || 0;
    const rate = Number(this.plot.sqft) || 0;

    if (b1 > 0 && b2 > 0 && l1 > 0 && l2 > 0) {
      const avgBreadth = (b1 + b2) / 2;
      const avgLength = (l1 + l2) / 2;
      const totalSqft = avgBreadth * avgLength;
      const totalPrice = totalSqft * rate;

      this.plot.totalSqft = Math.round(totalSqft);
      this.plot.price = Math.round(totalPrice);
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  goBackToList() {
    this.router.navigate(['/plots']);
  }
}
