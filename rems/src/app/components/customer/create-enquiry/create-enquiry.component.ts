import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { ToastrService } from 'ngx-toastr';
import { Layout } from '../../../models/layout';

@Component({
  selector: 'app-create-enquiry',
  standalone: false,
  templateUrl: './create-enquiry.component.html',
  styleUrl: './create-enquiry.component.css'
})
export class CreateEnquiryComponent {
  layoutList: Layout[] = [];
  showOtherLayout: boolean = false;
  selectedLayoutName: string = '';

  constructor(
    private customerService: CustomerService,
    private layoutService: LayoutserviceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchLayouts();
  }

  fetchLayouts() {
    this.layoutService.getLayouts().subscribe({
      next: (layouts) => this.layoutList = layouts,
      error: (err) => console.error('Error fetching layouts', err)
    });
  }

  onLayoutNameChange() {
    if (this.selectedLayoutName === 'Others') {
      this.showOtherLayout = true;
      this.enquiry.layoutName = '';
      this.enquiry.layoutLocation = '';
    } else {
      this.showOtherLayout = false;
      this.enquiry.layoutName = this.selectedLayoutName;
      const selected = this.layoutList.find(l => l.layoutName === this.selectedLayoutName);
      this.enquiry.layoutLocation = selected ? selected.location : '';
    }
  }

  limitAadharLength() {
    // Logic to limit aadhar length if needed
  }

  enquiry: Enquiry = {
    mobileNo: undefined as any,
    firstName: '',
    lastName: '',
    fatherName: '',
    email: '',
    address: '',
    pincode: undefined as any,
    aadharNo: '',
    panNo: '',
    referralNumber: '',
    layoutName: '',
    layoutLocation: '',
    comment: ''
  }

  mobileExists: boolean = false;
  duplicateMobileName: string = '';
  selectedImage: File | null = null;
  commentWordCount: number = 0;
  maxWords: number = 500;

  getWordCount(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  onCommentChange() {
    this.commentWordCount = this.getWordCount(this.enquiry.comment || '');
  }

  onMobileChange() {
    this.duplicateMobileName = '';
    if (this.enquiry.mobileNo && this.enquiry.mobileNo.toString().length === 10) {
      this.customerService.checkMobileName(this.enquiry.mobileNo).subscribe(name => {
        this.duplicateMobileName = name;
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedImage = file || null;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {

      // 1️⃣ Check Mobile Duplicate ONLY if provided
      if (this.enquiry.mobileNo) {
        this.customerService.checkMobileName(this.enquiry.mobileNo).subscribe(existingName => {
          if (existingName && existingName.trim() !== '') {
            this.duplicateMobileName = existingName;
            this.toastr.warning(`This mobile number already exists under the name: ${existingName}`);
            return;
          }
          this.proceedWithEmailCheck(form);
        });
      } else {
        this.proceedWithEmailCheck(form);
      }
    }
  }

  private proceedWithEmailCheck(form: NgForm) {
    // 2️⃣ EMAIL OPTIONAL → If empty, skip email check
    if (!this.enquiry.email || this.enquiry.email.trim() === '') {
      this.saveCustomer(form);
    } else {
      // 3️⃣ Email is entered → check duplicate
      this.customerService.checkEmailExists(this.enquiry.email).subscribe(emailExists => {
        if (emailExists) {
          this.toastr.warning('Email already exists!');
          return;
        }
        this.saveCustomer(form);
      });
    }
  }

  private saveCustomer(form: NgForm) {
    this.customerService.createCustomer(this.enquiry).subscribe({
      next: (created) => {
        if (this.selectedImage) {
          this.customerService.uploadCustomerImage(this.enquiry.mobileNo, this.selectedImage).subscribe({
            next: () => {
              this.toastr.success('Customer Created Successfully!');
              form.reset();
              this.router.navigate(['/view-enquiries']);
            },
            error: () => {
              this.toastr.error('Image upload failed');
              form.reset();
              this.router.navigate(['/view-enquiries']);
            }
          });
        } else {
          this.toastr.success('Customer Created Successfully!');
          form.reset();
          this.router.navigate(['/view-enquiries']);
        }
      },
      error: err => this.toastr.error(err.error)
    });
  }

  goHome() {
    // navigate to home page
    this.router.navigate(['/dashboard']);
  }


}


