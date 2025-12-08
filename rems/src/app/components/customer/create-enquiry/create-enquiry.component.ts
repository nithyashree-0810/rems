import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-create-enquiry',
  standalone: false,
  templateUrl: './create-enquiry.component.html',
  styleUrl: './create-enquiry.component.css'
})
export class CreateEnquiryComponent {
constructor(private customerService:CustomerService,private router:Router){}
  enquiry:Enquiry={

    mobileNo:0,
    firstName:'',
    lastName:'',
    email:'',
    address:'',
    pincode:0,
    aadharNo:'',
    panNo:'',

    
  }
mobileExists: boolean = false;

onSubmit(form: NgForm) {
    if (form.valid) {
      this.customerService.checkMobileExists(this.enquiry.mobileNo).subscribe(mobileExists => {
        if (mobileExists) {
          alert('Mobile number already exists!');
          return;
        }

        this.customerService.checkEmailExists(this.enquiry.email).subscribe(emailExists => {
          if (emailExists) {
            alert('Email already exists!');
            return;
          }

          this.customerService.createCustomer(this.enquiry).subscribe({
            next: () => {
              alert('Customer Created Successfully!');
              form.reset();
              this.router.navigate(['/view-enquiries']);
            },
            error: err => alert(err.error)
          });
        });
      });
    }
  }


goHome() {
    // navigate to home page
   this.router.navigate(['/dashboard']);
  }


}
