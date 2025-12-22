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

  layout:Layout=new Layout();
  constructor(private layoutService: LayoutserviceService,private router: Router, private toastr: ToastrService) {}

   onSubmit(form: any) {
  console.log("Form Values:", this.layout);
  if (form.valid) {
    this.layoutService.createLayout(this.layout).subscribe({
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
    console.log('View Layout clicked');
    // Navigate or show layout preview
    this.router.navigate(['/layouts']);
  }

  goHome() {
    console.log('Home clicked');
    // Navigate to home screen
    this.router.navigate(['/dashboard']);
  }
}
