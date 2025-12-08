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

  searchText: string = "";
  allData: Enquiry[] = [];

  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  customer: Enquiry[] = [];
  totalPagesArray: number[] = [];

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.customerService.getAllCustomers().subscribe((data: Enquiry[]) => {

      // Clean unnecessary spaces
      this.allData = data.map(c => ({
        ...c,
        firstName: c.firstName?.trim(),
        lastName: c.lastName?.trim(),
        address: c.address?.trim()
      }));

      this.applyPagination();
    });
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.allData.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.customer = this.allData.slice(start, end);
  }

  fetchLayouts(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  // 🔍 SEARCH FUNCTION
  onSearch() {
    const keyword = this.searchText.trim();

    if (keyword === "") {
      this.loadData();
      return;
    }

    this.customerService.searchCustomers(keyword).subscribe((data) => {
      this.allData = data;
      this.currentPage = 1;
      this.applyPagination();
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
