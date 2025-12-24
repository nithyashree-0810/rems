import { Component } from '@angular/core';
import { Layout } from '../../models/layout';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  layout: Layout = new Layout();
  selectedPdf: File | null = null;

  constructor(
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onPdfSelected(event: any) {
    this.selectedPdf = event.target.files[0];
    console.log("Selected PDF:", this.selectedPdf);
  }

  onSubmit(form: NgForm) {

    if (!this.selectedPdf) {
      this.toastr.error("Please upload layout PDF");
      return;
    }

    if (form.valid) {
      const formData = new FormData();

      formData.append(
        "layoutData",
        new Blob([JSON.stringify(this.layout)], { type: "application/json" })
      );

      formData.append("layoutPdf", this.selectedPdf);

      this.layoutService.createLayout(formData).subscribe({
        next: () => {
          this.toastr.success('Layout created successfully!');
          this.router.navigate(['/layouts']);
        },
        error: err => {
          console.error('Error creating layout', err);
          this.toastr.error('Failed to create layout');
        }
      });
    }
  }

  gotoView() {
    this.router.navigate(['/layouts']);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
