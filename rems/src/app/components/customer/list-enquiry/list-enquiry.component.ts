import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-list-enquiry',
   standalone: false, 
  templateUrl: './list-enquiry.component.html',
  styleUrl: './list-enquiry.component.css'
})
export class ListEnquiryComponent implements OnInit {

  searchName: string = '';
  searchMobile: string = '';

  allData: Enquiry[] = [];
  filteredData: Enquiry[] = [];
  paginatedCustomers: Enquiry[] = [];

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];   // ✅ HTML uses this

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  /* LOAD DATA */
  loadData() {
    this.customerService.getAllCustomers().subscribe((data: Enquiry[]) => {

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

  /* PAGINATION */
  applyPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    this.pages = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedCustomers = this.filteredData.slice(start, end);
  }

  /* PAGE ACTIONS */
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  /* SEARCH */
  onSearch() {
    const nameKeyword = this.searchName.trim().toLowerCase();
    const mobileKeyword = this.searchMobile.trim();

    this.filteredData = this.allData.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchesName = nameKeyword ? fullName.includes(nameKeyword) : true;
      const matchesMobile = mobileKeyword
        ? c.mobileNo?.toString().includes(mobileKeyword)
        : true;

      return matchesName && matchesMobile;
    });

    this.currentPage = 1;
    this.applyPagination();
  }

  /* ACTIONS */
  createEnquiry() {
    this.router.navigate(['/create-enquiry']);
  }

  editCustomer(enquiry: Enquiry) {
    this.router.navigate(['/edit-enquiry', enquiry.mobileNo]);
  }

  viewcustomer(mobileNo: number) {
    this.router.navigate(['/view-customer', mobileNo]);
  }

  deleteCustomer(mobileNo: number) {
    if (confirm('Are you sure to delete this customer?')) {
      this.customerService.deleteCustomer(mobileNo).subscribe({
        next: msg => {
          this.toastr.success(msg);
          this.loadData();
        },
        error: err => console.error('Delete failed', err)
      });
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
