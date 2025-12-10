import { Component, OnInit } from '@angular/core';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Router } from '@angular/router';
import { Plot } from '../../../models/plot';
import { Layout } from '../../../models/layout';

@Component({
  selector: 'app-create-plot',
  standalone: false,
  templateUrl: './create-plot.component.html',
  styleUrls: ['./create-plot.component.css']
})
export class CreatePlotComponent implements OnInit {

  layouts: Layout[] = [];

  // ✅ ngModel binding object
  newPlot: Plot = {
    plotNo: '',
    sqft: 0,
    direction: '',
    breadthOne: 0,
    breadthTwo: 0,
    lengthOne: 0,
    lengthTwo: 0,
    totalSqft: 0,
    price: 0,
    address: '',
    mobile: 0,
    ownerName: '',
    email: '',
    dtcpApproved: false,
    reraApproved: false,
    booked: false,
    layout: new Layout()   // ✅ Use Layout object
  };

  constructor(
    private layoutService: LayoutserviceService,
    private plotService: PlotserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
  }

  // ✅ Get layouts from backend
  loadLayouts(): void {
    this.layoutService.getLayouts().subscribe({
      next: (data: Layout[]) => {
        this.layouts = data;
        console.log('Layouts loaded ✅', data);
      },
      error: (err) => {
        console.error('Layouts loading error ❌', err);
      }
    });
  }

  // ✅ When dropdown changes
  onLayoutChange(event: any): void {
    const selectedName = event.target.value;
    // Assign the selected Layout object
    const selectedLayout = this.layouts.find(l => l.layoutName === selectedName);
    if (selectedLayout) {
      this.newPlot.layout = selectedLayout;
      console.log('Selected layout 👉', this.newPlot.layout);
    }
  }

  // ✅ Auto calculate sqft + price
  calculateValues(): void {
    const b1 = Number(this.newPlot.breadthOne) || 0;
    const b2 = Number(this.newPlot.breadthTwo) || 0;
    const l1 = Number(this.newPlot.lengthOne) || 0;
    const l2 = Number(this.newPlot.lengthTwo) || 0;
    const rate = Number(this.newPlot.sqft) || 0;

    if (b1 > 0 && b2 > 0 && l1 > 0 && l2 > 0) {
      const avgBreadth = (b1 + b2) / 2;
      const avgLength = (l1 + l2) / 2;
      const totalSqft = avgBreadth * avgLength;
      const totalPrice = totalSqft * rate;

      this.newPlot.totalSqft = Math.round(totalSqft);
      this.newPlot.price = Math.round(totalPrice);
    }
  }

  // ✅ Save plot
  savePlot(): void {
    if (!this.newPlot.layout.layoutName) {
      alert("Please select Layout");
      return;
    }

    console.log("FINAL DATA 👉", this.newPlot);

    this.plotService.createPlot(this.newPlot).subscribe({
      next: (res: string) => {
        alert(res);   // Plot created successfully!
        this.router.navigate(['/plots']); 
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Backend error:', error);
        if (error.status === 409) {
          alert("Plot No already exists. Try another Plot No");
        } else {
          alert('Server error. Check console');
        }
      }
    });
  }

  uploadExcel(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    this.plotService.uploadPlotsExcel(formData).subscribe({
      next: (res: string) => alert(res),
      error: (err) => {
        console.error(err);
        alert("Excel upload failed.");
      }
    });
  }

  // ✅ Reset form
  resetForm(): void {
    this.newPlot = {
      plotNo: '',
      sqft: 0,
      direction: '',
      breadthOne: 0,
      breadthTwo: 0,
      lengthOne: 0,
      lengthTwo: 0,
      totalSqft: 0,
      price: 0,
      address: '',
      mobile: 0,
      ownerName: '',
      email: '',
      dtcpApproved: false,
      reraApproved: false,
      booked: false,
      layout: new Layout()   // ✅ reset layout properly
    };
  }

  // ✅ Home button
  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
