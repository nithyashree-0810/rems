import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotserviceService } from '../../../services/plotservice.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';

@Component({
  selector: 'app-edit-plot',
  standalone: false,
  templateUrl: './edit-plot.component.html',
  styleUrls: ['./edit-plot.component.css']
})
export class EditPlotComponent implements OnInit {

  plotNo: any;

 
plot: any;
layouts: any;


  constructor(
    private route: ActivatedRoute,
    private plotService: PlotserviceService,
    private router: Router,
    private layoutService: LayoutserviceService
  ) {}

  

  ngOnInit(): void {

  this.plotNo = this.route.snapshot.paramMap.get('plotNo');

  if (this.plotNo) {
    this.plotService.getPlotByPlotNo(this.plotNo).subscribe(data => {
      this.plot = data;   // 👈 MUST BE plot
      console.log("EDIT PLOT DATA:", this.plot);
    });

    this.layoutService.getLayouts().subscribe(res => {
  this.layouts = res;
});


  }

}
  updatePlot() {
  console.log("UPDATING PLOT:", this.plot);

  this.plotService.updatePlotByPlotNo(this.plotNo, this.plot)
    .subscribe({
      next: (res) => {
        alert('Plot updated successfully');
        this.router.navigate(['/plots']);
      },
      error: (err) => {
        console.error(err);
        alert('Update failed');
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
