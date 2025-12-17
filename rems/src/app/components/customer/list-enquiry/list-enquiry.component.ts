import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-list-enquiry',
  standalone: false,
  templateUrl: './list-enquiry.component.html',
  styleUrl: './list-enquiry.component.css'
})
export class ListEnquiryComponent {

  searchName: string = "";
  searchMobile: string = "";

  allData: Enquiry[] = [];                // All loaded customers
  filteredData: Enquiry[] = [];           // Data filtered by search
  paginatedCustomers: Enquiry[] = [];    // Current page data

  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  totalPagesArray: number[] = [];

  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.customerService.getAllCustomers().subscribe((data: Enquiry[]) => {

      // Clean whitespace
      this.allData = data.map(c => ({
        ...c,
        firstName: c.firstName?.trim(),
        lastName: c.lastName?.trim(),
        address: c.address?.trim()
      }));

      // Initially filteredData = allData
      this.filteredData = [...this.allData];

      this.currentPage = 1;
      this.applyPagination();
    });
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

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
          alert(msg);
          this.loadData();
        },
        error: (err) => console.error("Delete failed", err)
      });
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
