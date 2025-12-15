import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Role } from '../../../models/role';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css'],
  standalone: false
})
export class EditRoleComponent implements OnInit {

  roleId!: number;

  // ✅ Backend model (role = string)
  role: Role = {
    roleId: 0,
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    address: '',
    aadharNo: '',
    panNo: '',
    role: ''          // ✅ STRING
  };

  // ✅ UI multiple select
  selectedRoles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleserviceServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.roleId = Number(this.route.snapshot.paramMap.get('roleId'));

    this.roleService.getByRoleId(this.roleId).subscribe({
      next: (data: Role) => {

        this.role = data;

        // ✅ backend string → UI array
        this.selectedRoles = data.role
          ? data.role.split(',')
          : [];
      },
      error: err => console.error('Fetch failed', err)
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {

      // ✅ UI array → backend string
      this.role.role = this.selectedRoles.join(',');

      this.roleService.updateRole(this.roleId, this.role).subscribe({
        next: () => {
          alert('Updated Successfully');
          this.router.navigate(['/list-role']);
        },
        error: () => alert('Update Failed')
      });
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
