import { Component, OnInit } from '@angular/core';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { PlotserviceService } from '../../../services/plotservice.service';
import { Router } from '@angular/router';
import { Plot } from '../../../models/plot';
import { Layout } from '../../../models/layout';
import { NgForm } from '@angular/forms';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-create-plot',
  standalone: false,
  templateUrl: './create-plot.component.html',
  styleUrls: ['./create-plot.component.css']
})
export class CreatePlotComponent implements OnInit {

  layouts: Layout[] = [];
  owners: Role[] = [];
  selectedOwnerId: number | null = null;

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
    surveyNumber:'',
    ownerName: '',
    email: '',
    layoutAddress: '',
    dtcpApproved: false,
    reraApproved: false,
    booked: false,
    layout: new Layout()   // ✅ Use Layout object
  };

  constructor(
    private layoutService: LayoutserviceService,
    private plotService: PlotserviceService,
    private router: Router,
    private roleService: RoleserviceServiceService
  ) {}

  ngOnInit(): void {
    this.loadLayouts();
    this.loadOwners();
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
  onLayoutChange(): void {
    const selectedLayout = this.newPlot.layout;
    if (selectedLayout && selectedLayout.address !== undefined) {
      this.newPlot.layoutAddress = selectedLayout.address || '';
    }
  }

  loadOwners(): void {
    this.roleService.getAll().subscribe({
      next: (data: Role[]) => {
        this.owners = (data || []).filter(r => (r.role || '').toLowerCase().includes('owner'));
      }
    });
  }

  onOwnerChange(): void {
    if (!this.selectedOwnerId) return;
    const owner = this.owners.find(o => o.roleId === this.selectedOwnerId);
    if (owner) {
      const fullName = [owner.firstName || '', owner.lastName || ''].join(' ').trim();
      this.newPlot.ownerName = fullName || owner.firstName || '';
      this.newPlot.address = owner.address || '';
      this.newPlot.mobile = Number(owner.mobileNo) || 0;
      this.newPlot.email = owner.email || '';
    }
  }

  // ✅ Auto calculate sqft + price (improved logic)
  calculateValues(): void {
    // normalize inputs to numbers
    const b1 = Number(this.newPlot.breadthOne) || 0;
    const b2 = Number(this.newPlot.breadthTwo) || 0;
    const l1 = Number(this.newPlot.lengthOne) || 0;
    const l2 = Number(this.newPlot.lengthTwo) || 0;
    const rate = Number(this.newPlot.sqft) || 0;
    const manualTotal = Number(this.newPlot.totalSqft) || 0;

    // Helper to compute price from total sqft and rate
    const computePrice = (total: number) => {
      if (rate > 0) {
        this.newPlot.price = Math.round(total * rate);
      } else {
        this.newPlot.price = 0;
      }
    };

    // 1) If all four breadth/length values are present -> compute using averages
    if (b1 > 0 && b2 > 0 && l1 > 0 && l2 > 0) {
      const avgBreadth = (b1 + b2) / 2;
      const avgLength = (l1 + l2) / 2;
      const totalSqft = avgBreadth * avgLength;
      this.newPlot.totalSqft = Math.round(totalSqft);
      computePrice(totalSqft);
      return;
    }

    // 2) If user has entered a manual totalSqft (and it's > 0) -> use it to compute price
    if (manualTotal > 0) {
      // keep totalSqft as entered (do not overwrite)
      this.newPlot.totalSqft = Math.round(manualTotal);
      computePrice(manualTotal);
      return;
    }

    // 3) Partial breadth/length inputs: if we have at least one breadth and one length,
    //    compute averages from the non-zero values.
    const breadths = [b1, b2].filter(v => v > 0);
    const lengths = [l1, l2].filter(v => v > 0);

    if (breadths.length > 0 && lengths.length > 0) {
      const avgBreadth = breadths.reduce((s, v) => s + v, 0) / breadths.length;
      const avgLength = lengths.reduce((s, v) => s + v, 0) / lengths.length;
      const totalSqft = avgBreadth * avgLength;
      this.newPlot.totalSqft = Math.round(totalSqft);
      computePrice(totalSqft);
      return;
    }

    // 4) Nothing enough to compute -> clear price (and don't clobber manual total if zero)
    this.newPlot.price = 0;
    // keep totalSqft as-is (if 0 it remains 0)
  }

  // ✅ Save plot
  savePlot(plotForm: NgForm) {
    if (!this.newPlot.layout.layoutName) {
      alert("Please select Layout");
      return;
    }
  if (plotForm.invalid) {
    plotForm.form.markAllAsTouched();   // <-- validation shows immediately
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
      surveyNumber:'',
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
