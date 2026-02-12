import { Component } from '@angular/core';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Router } from '@angular/router';
import { Role } from '../../../models/role';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-role',
  standalone: false,
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  role: Role = new Role();
  selectedImage: File | null = null;
  duplicateMobileName: string = '';

  constructor(
    private roleService: RoleserviceServiceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedImage = file || null;
  }

  onMobileChange() {
    this.duplicateMobileName = '';
    if (this.role.mobileNo && this.role.mobileNo.length === 10) {
      this.roleService.checkMobileName(this.role.mobileNo).subscribe(name => {
        this.duplicateMobileName = name;
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {

      // 1️⃣ Check Mobile Duplicate ONLY if provided
      if (this.role.mobileNo && this.role.mobileNo.trim() !== '') {
        this.roleService.checkMobileName(this.role.mobileNo).subscribe(existingName => {
          if (existingName && existingName.trim() !== '') {
            this.duplicateMobileName = existingName;
            this.toastr.warning(`Mobile number already exists under the name: ${existingName}`);
            return;
          }
          this.proceedWithEmailCheck(form);
        });
      } else {
        this.proceedWithEmailCheck(form);
      }
    }
  }

  private proceedWithEmailCheck(form: NgForm) {
    // 2️⃣ EMAIL OPTIONAL → If empty, skip email check
    if (!this.role.email || this.role.email.trim() === '') {
      this.saveRole(form);
    } else {
      // 3️⃣ Email is entered → check duplicate
      this.roleService.checkEmailExists(this.role.email).subscribe(emailExists => {
        if (emailExists) {
          this.toastr.warning('Email already exists!');
          return;
        }
        this.saveRole(form);
      });
    }
  }

  private saveRole(form: NgForm) {
    this.roleService.createRole(this.role).subscribe({
      next: (created) => {
        if (created && created.roleId && this.selectedImage) {
          this.roleService.uploadRoleImage(created.roleId, this.selectedImage).subscribe({
            next: () => {
              this.toastr.success('Created Successfully!');
              form.reset();
              this.router.navigate(['/list-role']);
            },
            error: () => {
              this.toastr.error('Image upload failed');
              form.reset();
              this.router.navigate(['/list-role']);
            }
          });
        } else {
          this.toastr.success('Created Successfully!');
          form.reset();
          this.router.navigate(['/list-role']);
        }
      },
      error: err => this.toastr.error(err.error)
    });
  }

  goHome() {
    // navigate to home page
    this.router.navigate(['/dashboard']);
  }


}


