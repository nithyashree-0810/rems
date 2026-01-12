import { Component } from '@angular/core';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-enquiry',
  standalone: false,
  templateUrl: './report-enquiry.component.html',
  styleUrl: './report-enquiry.component.css'
})
export class ReportEnquiryComponent {


  searchName: string = "";
  searchMobile: string = "";

  allData: Enquiry[] = [];                // All loaded customers
  filteredData: Enquiry[] = [];           // Data filtered by search
  paginatedCustomers: Enquiry[] = [];     // Current page data

  totalPages: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPagesArray: number[] = [];
  pages:number[] = [];

  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  // ✅ ONLY ONE CONSTRUCTOR (FIXED)
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

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

 applyPagination() {
  this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

  // 🔥 HTML expects `pages`
  this.pages = Array.from(
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
    if (confirm("Are you sure to delete this customer?")) {
      this.customerService.deleteCustomer(mobileNo).subscribe({
        next: (msg) => {
          this.toastr.success(msg);
          this.loadData();
        },
        error: (err) => console.error("Delete failed", err)
      });
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  downloadEnquiriesReport(): void {

  // 🔹 search irundha → filtered data
  // 🔹 search illa na → all data
  const dataToDownload =
    (this.searchName || this.searchMobile)
      ? this.filteredData
      : this.allData;

  if (!dataToDownload || dataToDownload.length === 0) {
    this.toastr.warning('No data to download');
    return;
  }

  this.reportService.downloadEnquiriesReport(dataToDownload).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      this.toastr.error('Failed to download customers report');
    }
  });
}

}


