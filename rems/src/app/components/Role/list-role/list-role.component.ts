import { Component } from '@angular/core';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Router } from '@angular/router';
import { Role } from '../../../models/role';

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
   paginatedCustomers: Role[] = [];    // Current page data
 
   totalPages: number = 0;
   pageSize: number = 5;
   currentPage: number = 1;
  totalPagesArray: number[] = [];

  constructor(private roleService:RoleserviceServiceService, private router: Router) {}

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
    this.paginatedCustomers = [];

    this.allData = data.map(c => ({
      ...c,
      firstName: c.firstName?.trim(),
      lastName: c.lastName?.trim(),
      address: c.address?.trim()
    }));

    this.filteredData = [...this.allData];
    this.currentPage = 1;
    this.applyPagination();
  });
}

 
   applyPagination() {
  this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages || 1;
  }

  this.totalPagesArray = Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;

  this.paginatedCustomers = this.filteredData.slice(start, end);
}

 
   fetchLayouts(page: number) {
     this.currentPage = page;
     this.applyPagination();
   }
 
   // Search using both name and mobile number, combined with AND condition
   onSearch() {
     const nameKeyword = this.searchName.trim().toLowerCase();
     const mobileKeyword = this.searchMobile.trim();
 
     this.filteredData = this.allData.filter(c => {
       const fullName = (c.firstName + ' ' + c.lastName).toLowerCase();
 
       const matchesName = nameKeyword ? fullName.includes(nameKeyword) : true;
       const matchesMobile = mobileKeyword ? c.mobileNo?.toString().includes(mobileKeyword) : true;
 
       return matchesName && matchesMobile;
     });
 
     this.currentPage = 1;
     this.applyPagination();
   }
 
   nextPage() {
     if (this.currentPage < this.totalPages) {
       this.fetchLayouts(this.currentPage + 1);
     }
   }
 
   prevPage() {
     if (this.currentPage > 1) {
       this.fetchLayouts(this.currentPage - 1);
     }
   }
 
   goToPage(page: number) {
     this.fetchLayouts(page);
   }
 
   createRole() {
     this.router.navigate(['/create-role']);
   }
 
   editRole(role: Role) {
     this.router.navigate(['/edit-role', role.roleId]);
   }
 
   viewRole(roleId: number) {
     this.router.navigate(['/view-role', roleId]);
   }
 
   deleteRole(roleId: number) {
  if (!confirm("Are you sure to delete this?")) {
    return;
  }

  this.roleService.deleteRole(roleId).subscribe({
    next: () => {
      alert("Deleted Successfully");

      // 🔥 Force reload from backend
      this.loadData();
    },
    error: err => {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  });
}


 
   goHome() {
     this.router.navigate(['/dashboard']);
   }
}
