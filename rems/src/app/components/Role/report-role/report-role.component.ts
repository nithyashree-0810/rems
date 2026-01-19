import { Component, OnInit } from '@angular/core';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Role } from '../../../models/role';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-role',
  standalone:false,
  templateUrl: './report-role.component.html',
  styleUrls: ['./report-role.component.css']
})
export class ReportRoleComponent implements OnInit {

  selectedRoleType: string = ''; // OWNER or AGENT
  allData: Role[] = [];
  filteredData: Role[] = [];
  searchName: string = "";
   searchMobile: string = "";
 paginatedCustomers: Role[] = [];    // Current page data
 
  totalPages: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
 pages: number[] = [];
roleFilteredData: Role[] = [];
showRoleColumn: boolean = true;


  constructor(
    private roleService: RoleserviceServiceService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.loadRoles();
}

loadRoles(): void {
  this.roleService.getAll().subscribe((data: Role[]) => {
    this.allData = data || [];
    this.filteredData = [...this.allData];   // 👈 ALL data default
    this.showRoleColumn = true;     
    
     this.filteredData = [...this.allData];
    this.currentPage = 1;
    this.applyPagination();// 👈 Role column visible
  });
}

applyPagination() {
  this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages || 1;
  }

  // 🔥 pages for pagination buttons
  this.pages = Array.from(
    { length: this.totalPages },
    (_, i) => i + 1
  );

  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;

  this.paginatedCustomers = this.filteredData.slice(start, end);
}

 onSearch() {
  const nameKeyword = this.searchName.trim().toLowerCase();
  const mobileKeyword = this.searchMobile.trim();

  const sourceData = this.selectedRoleType
    ? this.filteredData
    : this.allData;

  this.filteredData = sourceData.filter(c => {
    const fullName = (c.firstName + ' ' + c.lastName).toLowerCase();

    const matchesName = nameKeyword ? fullName.includes(nameKeyword) : true;
    const matchesMobile = mobileKeyword
      ? c.mobileNo?.toString().includes(mobileKeyword)
      : true;

    return matchesName && matchesMobile;
  });
}

 fetchLayouts(page: number) {
     this.currentPage = page;
     this.applyPagination();
   }

  filterRoles(): void {

  // ❗ Role select pannala na
  if (!this.selectedRoleType) {
    this.filteredData = [...this.allData];   // ALL data
    this.showRoleColumn = true;               // Role column SHOW
    return;
  }

  // Role select pannina
  this.filteredData = this.allData.filter(r => {
    if (!r.role) return false;

    return r.role
      .split(',')
      .map(role => role.trim().toLowerCase())
      .includes(this.selectedRoleType.toLowerCase());
  });

  this.showRoleColumn = false;   // 👈 Role column HIDE
}



generateReport(): void {

  if (!this.filteredData || this.filteredData.length === 0) {
    alert('No data to generate report');
    return;
  }

  this.reportService.downloadRoleReport(this.filteredData)
    .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'role-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('PDF generation failed');
      }
    });
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

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}

