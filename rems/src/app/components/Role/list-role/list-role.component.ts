import { Component } from '@angular/core';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Router } from '@angular/router';
import { Role } from '../../../models/role';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-role',
  standalone: false,
  templateUrl: './list-role.component.html',
  styleUrl: './list-role.component.css'
})
export class ListRoleComponent {
  searchName: string = "";
  searchMobile: string = "";

  allData: Role[] = [];                // All loaded customers
  filteredData: Role[] = [];           // Data filtered by search
  pageSize: number = 10;
  currentPage: number = 1;


  constructor(private roleService: RoleserviceServiceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  loadData() {
    this.roleService.getAll().subscribe((data: Role[]) => {

      // 🔥 Clear old data
      this.allData = [];
      this.filteredData = [];

      this.allData = [...data]
        .sort((a, b) => Number(b.roleId) - Number(a.roleId))
        .map(c => ({
          ...c,
          firstName: c.firstName?.trim(),
          lastName: c.lastName?.trim(),
          address: c.address?.trim()
        }));


      this.filteredData = [...this.allData];
      this.currentPage = 1;
    });
  }


  goToPage(page: number) {
    this.currentPage = page;
  }

  onSearch() {
    this.roleService.advancedSearch(
      this.searchName,
      undefined,
      this.searchMobile,
      undefined,
      undefined
    ).subscribe(data => {
      this.filteredData = data.sort((a, b) => Number(b.roleId) - Number(a.roleId));
      this.currentPage = 1;
    });
  }

  createRole() {
    this.router.navigate(['/create-role']);
  }

  editRole(role: Role) {
    this.router.navigate(['/edit-role', role.roleId]);
  }

  viewRole(roleId: number) {
    this.router.navigate(['/view-customer', roleId]);
  }

  deleteRole(roleId: number) {
    if (!confirm("Are you sure to delete this?")) {
      return;
    }

    this.roleService.deleteRole(roleId).subscribe({
      next: () => {
        this.toastr.success("Deleted Successfully");

        // 🔥 Force reload from backend
        this.loadData();
      },
      error: err => {
        console.error("Delete failed", err);
        this.toastr.error("Delete failed");
      }
    });
  }



  onClear() {
    this.searchName = '';
    this.searchMobile = '';
    this.currentPage = 1;
    this.loadData();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
