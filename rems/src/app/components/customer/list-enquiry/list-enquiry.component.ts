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
 totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  customer: Enquiry[] = [];
  totalPagesArray: number[] = [];

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchLayouts(this.currentPage);
  }

 fetchLayouts(page: number) {
  this.customerService.getAllCustomers().subscribe((data: Enquiry[]) => {
    // 1️⃣ Trim unwanted spaces
    const cleanedData = data.map(c => ({
      ...c,
      firstName: c.firstName?.trim(),
      lastName: c.lastName?.trim(),
      address: c.address?.trim()
    }));

    // 2️⃣ Use backend order (latest created record first)
    const allCustomers = cleanedData;

    // 3️⃣ Pagination logic
    this.totalPages = Math.ceil(allCustomers.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.customer = allCustomers.slice(startIndex, endIndex);

    this.currentPage = page;
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
    debugger
    this.router.navigate(['/edit-enquiry', enquiry.mobileNo]);
  }
//   viewLayout(layoutName: string) { 
//   this.router.navigate(['/view-layout', layoutName]);
//  }
viewcustomer(mobileNo:number){
this.router.navigate(['/view-customer',mobileNo])
}
 deleteCustomer(mobileNo: number) {
  if (confirm("Are you sure to delete this customer?")) {
    this.customerService.deleteCustomer(mobileNo).subscribe({
      next: (msg) => {
        alert(msg);  // backend message show pannum
        this.fetchLayouts(this.currentPage);
      },
      error: (err) => console.error("Delete failed", err)
    });
  }
}

 goHome() {
    // navigate to home page
   this.router.navigate(['/dashboard']);
  }
}



