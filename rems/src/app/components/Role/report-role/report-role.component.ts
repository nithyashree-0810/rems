import { Component, OnInit } from '@angular/core';
import { RoleserviceServiceService } from '../../../services/roleservice.service.service';
import { Role } from '../../../models/role';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-role',
  standalone: false,
  templateUrl: './report-role.component.html',
  styleUrls: ['./report-role.component.css']
})
export class ReportRoleComponent implements OnInit {

  selectedRoleType: string = '';
  allData: Role[] = [];
  filteredData: Role[] = [];
  searchName: string = "";
  searchMobile: string = "";

  currentPage: number = 1;
  pageSize: number = 10;
  showRoleColumn: boolean = true;
  rolesList: string[] = ['Owner', 'Agent'];


  constructor(
    private roleService: RoleserviceServiceService,
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe((data: Role[]) => {
      this.allData = data || [];
      this.filteredData = [...this.allData];
      this.showRoleColumn = true;
      this.currentPage = 1;
    });
  }


  onSearch() {
    const nameKeyword = this.searchName.trim().toLowerCase();
    const mobileKeyword = this.searchMobile.trim();

    const sourceData = this.selectedRoleType
      ? this.allData.filter(r => {
        if (!r.role) return false;
        return r.role.toLowerCase().includes(this.selectedRoleType.toLowerCase());
      })
      : this.allData;

    this.filteredData = sourceData.filter(c => {
      const fullName = (c.firstName + ' ' + c.lastName).toLowerCase();
      const matchesName = !nameKeyword || fullName.includes(nameKeyword);
      const matchesMobile = !mobileKeyword || c.mobileNo?.toString().includes(mobileKeyword);
      return matchesName && matchesMobile;
    });

    this.currentPage = 1;
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
    this.currentPage = 1;
  }



  generateReport(): void {

    if (!this.filteredData || this.filteredData.length === 0) {
      alert('No data to generate report');
      return;
    }

    const dataToDownload = this.filteredData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );

    this.reportService.downloadRoleReport(dataToDownload)
      .subscribe({
        next: (blob: Blob) => {
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


  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}

