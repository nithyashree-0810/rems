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


  constructor(private roleService: RoleserviceServiceService, private router: Router, private toastr: ToastrService) { }
  role: Omit<Role, 'roleId'> = {
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    address: '',
    aadharNo: '',
    panNo: '',
    role: ''
  };
  mobileExists: boolean = false;
  selectedImage: File | null = null;

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedImage = file || null;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {

      // 1️⃣ Check Mobile Duplicate First
      this.roleService.checkMobileExists(this.role.mobileNo).subscribe(mobileExists => {
        if (mobileExists) {
          this.toastr.warning('Mobile number already exists!');
          return;
        }

        // 2️⃣ EMAIL OPTIONAL → If empty, skip email check
        if (!this.role.email || this.role.email.trim() === '') {

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

        } else {

          // 3️⃣ Email is entered → check duplicate
          this.roleService.checkEmailExists(this.role.email).subscribe(emailExists => {
            if (emailExists) {
              this.toastr.warning('Email already exists!');
              return;
            }

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

          });

        }

      });

    }



  }

  goHome() {
    // navigate to home page
    this.router.navigate(['/dashboard']);
  }


}


