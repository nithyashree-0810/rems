import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-enquiry',
  standalone: false,
  templateUrl: './view-enquiry.component.html',
  styleUrl: './view-enquiry.component.css'
})
export class ViewEnquiryComponent {
  customer: Enquiry = new Enquiry();
  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  formatAddress(address?: string) {
    if (!address) return '';
    return address.split(',').map(part => part.trim()).join('\n');
  }
  constructor(private route: ActivatedRoute, private router: Router,
    private customerService: CustomerService,
    private location: Location
  ) { }
  ngOnInit(): void {
    const mobileNoStr = this.route.snapshot.paramMap.get('mobileNo');
    if (mobileNoStr) {
      const mobileNo = Number(mobileNoStr);
      this.customerService.getCustomerByMobile(mobileNo).subscribe({
        next: data => this.customer = data,
        error: err => console.error("Failed to load customer:", err)
      });
    }
  }
  goHome() {
    this.location.back();
  }
}


