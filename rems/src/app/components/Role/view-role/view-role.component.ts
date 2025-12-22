import { Component } from '@angular/core';
import { Role } from '../../../models/role';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';

@Component({
  selector: 'app-view-role',
  standalone: false,
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent {

  role: Role = new Role();
  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleserviceServiceService
  ) {}

  ngOnInit(): void {
    const roleId = Number(this.route.snapshot.paramMap.get('roleId'));
    if (roleId) {
      this.roleService.getByRoleId(roleId).subscribe((data: Role) => {
  this.role = data;
      });
    }
  }

  goBack() {
    this.router.navigate(['/list-role']);
  }

}
