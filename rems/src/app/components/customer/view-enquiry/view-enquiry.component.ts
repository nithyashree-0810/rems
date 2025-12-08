import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-view-enquiry',
  standalone: false,
  templateUrl: './view-enquiry.component.html',
  styleUrl: './view-enquiry.component.css'
})
export class ViewEnquiryComponent {
 customer:Enquiry=new Enquiry();
  constructor(private route:ActivatedRoute,private router:Router,
    private customerService:CustomerService
  ){}
 ngOnInit(): void {
  const mobileNoStr = this.route.snapshot.paramMap.get('mobileNo');
  if(mobileNoStr){
    const mobileNo = Number(mobileNoStr);
    this.customerService.getCustomerByMobile(mobileNo).subscribe({
      next: data => this.customer = data,
      error: err => console.error("Failed to load customer:", err)
    });
  }
}
goHome(){
  this.router.navigate(['/view-enquiries'])
}
}


