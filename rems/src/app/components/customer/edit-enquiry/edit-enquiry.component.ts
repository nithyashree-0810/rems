import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { LayoutserviceService } from '../../../services/layoutservice.service';
import { Layout } from '../../../models/layout';

@Component({
  selector: 'app-edit-enquiry',
  standalone: false,
  templateUrl: './edit-enquiry.component.html',
  styleUrl: './edit-enquiry.component.css'
})
export class EditEnquiryComponent {
  customer: Enquiry = new Enquiry();
  selectedImage: File | null = null;
  layoutList: Layout[] = [];
  showOtherLayout: boolean = false;
  selectedLayoutName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private layoutService: LayoutserviceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const mobileNoStr = this.route.snapshot.paramMap.get('mobileNo');
    this.fetchLayouts();
    if (mobileNoStr) {
      const mobileNo = Number(mobileNoStr);
      this.customerService.getCustomerByMobile(mobileNo).subscribe({
        next: (data) => {
          this.customer = data;
          this.selectedLayoutName = this.customer.layoutName || '';
        },
        error: err => console.error("Failed to load customer:", err)
      });
    }
  }

  fetchLayouts() {
    this.layoutService.getLayouts().subscribe({
      next: (layouts) => {
        this.layoutList = layouts;
      },
      error: (err) => console.error('Error fetching layouts', err)
    });
  }

  onLayoutNameChange() {
    if (this.selectedLayoutName === 'Others') {
      this.showOtherLayout = true;
      this.customer.layoutName = '';
      this.customer.layoutLocation = '';
    } else {
      this.showOtherLayout = false;
      this.customer.layoutName = this.selectedLayoutName;
      const selected = this.layoutList.find(l => l.layoutName === this.selectedLayoutName);
      this.customer.layoutLocation = selected ? selected.location : '';
    }
  }
  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedImage = file || null;
  }
  onSubmit() {
    const mobileNoStr = this.route.snapshot.paramMap.get('mobileNo');
    if (mobileNoStr) {
      debugger
      const mobileNo = Number(mobileNoStr); // convert string to number
      this.customerService.updateCustomer(mobileNo, this.customer).subscribe({
        next: () => {
          if (this.selectedImage) {
            this.customerService.uploadCustomerImage(mobileNo, this.selectedImage).subscribe({
              next: () => {
                this.toastr.success('Customer Updated Successfully');
                this.router.navigate(['/view-enquiries']);
              },
              error: () => {
                this.toastr.error('Image upload failed');
                this.router.navigate(['/view-enquiries']);
              }
            });
          } else {
            this.toastr.success('Customer Updated Successfully');
            this.router.navigate(['/view-enquiries']);
          }
        },
        error: err => console.error("Update failed:", err)
      });
    }
  }
  goHome() {
    this.router.navigate(['/view-enquiries'])
  }
}
