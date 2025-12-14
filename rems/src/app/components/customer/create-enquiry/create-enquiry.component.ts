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
limitAadharLength() {
throw new Error('Method not implemented.');
}
constructor(private customerService:CustomerService,private router:Router){}
  enquiry:Enquiry={

mobileNo: undefined as any,
    firstName:'',
    lastName:'',
    fatherName:'',
    email:'',
    address:'',
  pincode: undefined as any,
    aadharNo:'',
    panNo:'',
   

    
  }
mobileExists: boolean = false;

onSubmit(form: NgForm) {
  if (form.valid) {

    // 1️⃣ Check Mobile Duplicate First
    this.customerService.checkMobileExists(this.enquiry.mobileNo).subscribe(mobileExists => {
      if (mobileExists) {
        alert('Mobile number already exists!');
        return;
      }

      // 2️⃣ EMAIL OPTIONAL → If empty, skip email check
      if (!this.enquiry.email || this.enquiry.email.trim() === '') {

        // Direct Customer Create
        this.customerService.createCustomer(this.enquiry).subscribe({
          next: () => {
            alert('Customer Created Successfully!');
            form.reset();
            this.router.navigate(['/view-enquiries']);
          },
          error: err => alert(err.error)
        });

      } else {

        // 3️⃣ Email is entered → check duplicate
        this.customerService.checkEmailExists(this.enquiry.email).subscribe(emailExists => {
          if (emailExists) {
            alert('Email already exists!');
            return;
          }

          // 4️⃣ Create customer if email is NOT duplicate
          this.customerService.createCustomer(this.enquiry).subscribe({
            next: () => {
              alert('Customer Created Successfully!');
              form.reset();
              this.router.navigate(['/view-enquiries']);
            },
            error: err => alert(err.error)
          });

        });

      }

    });

  }

  

}

goHome() {
    // navigate to home page
   this.router.navigate(['/dashboard']);
  }


}


