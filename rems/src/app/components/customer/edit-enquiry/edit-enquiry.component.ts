import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-edit-enquiry',
  standalone: false,
  templateUrl: './edit-enquiry.component.html',
  styleUrl: './edit-enquiry.component.css'
})
export class EditEnquiryComponent {
customer:Enquiry=new Enquiry();
selectedImage: File | null = null;
constructor(private route:ActivatedRoute,private router:Router,private customerService:CustomerService){}

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
onFileChange(event: any) {
  const file = event.target.files?.[0];
  this.selectedImage = file || null;
}
onSubmit(){
  const mobileNoStr = this.route.snapshot.paramMap.get('mobileNo');
  if(mobileNoStr){
    debugger
    const mobileNo = Number(mobileNoStr); // convert string to number
    this.customerService.updateCustomer(mobileNo, this.customer).subscribe({
      next: () => {
        if (this.selectedImage) {
          this.customerService.uploadCustomerImage(mobileNo, this.selectedImage).subscribe({
            next: () => {
              alert('Customer Updated Successfully');
              this.router.navigate(['/view-enquiries']);
            },
            error: () => {
              alert('Image upload failed');
              this.router.navigate(['/view-enquiries']);
            }
          });
        } else {
          alert('Customer Updated Successfully');
          this.router.navigate(['/view-enquiries']);
        }
      },
      error: err => console.error("Update failed:", err)
    });
  }
}
goHome(){
  this.router.navigate(['/dashboard'])
}

}
