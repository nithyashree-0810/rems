import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Plot } from '../../../models/plot';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-plot',
  standalone: false,
  templateUrl: './view-plot.component.html',
  styleUrls: ['./view-plot.component.css']
})
export class ViewPlotComponent implements OnInit {

  layoutName: string = '';
  plotNo: any;
  plot?: Plot | null;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotserviceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

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
            this.toastr.error("Plot not found");
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

  viewLayoutPdf() {
    if (this.plot?.layout?.layoutName) {
      const url = `http://localhost:8080/api/layouts/pdf/${this.plot.layout.layoutName}`;
      window.open(url, "_blank");
    }
  }
}
