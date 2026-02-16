import { Component } from '@angular/core';
import { Enquiry } from '../../../models/enquiry';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-enquiry',
  standalone: false,
  templateUrl: './report-enquiry.component.html',
  styleUrl: './report-enquiry.component.css'
})
export class ReportEnquiryComponent {


  searchName: string = "";
  searchMobile: string = "";
  searchLocation: string = '';
  searchReferral: string = '';
  searchLayoutName: string = '';
  searchAddress: string = '';
  activeSearchTab: string = 'general';

  allData: Enquiry[] = [];                // All loaded customers
  filteredData: Enquiry[] = [];           // Data filtered by search
  currentPage: number = 1;
  pageSize: number = 10;

  imageUrl(path?: string) {
    return path ? `http://localhost:8080${path}` : '';
  }

  // ✅ ONLY ONE CONSTRUCTOR (FIXED)
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.customerService.getAllCustomers().subscribe((data: Enquiry[]) => {

      this.allData = data.map(c => ({
        ...c,
        firstName: c.firstName?.trim(),
        lastName: c.lastName?.trim(),
        address: c.address?.trim()
      })).sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return dateB - dateA;
      });

      this.filteredData = [...this.allData];
      this.currentPage = 1;
    });
  }

  onSearch() {
    this.customerService.advancedSearch(
      this.searchLocation,
      this.searchReferral,
      this.searchLayoutName,
      this.searchName,
      this.searchMobile,
      this.searchAddress
    ).subscribe(data => {
      this.filteredData = data.sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return dateB - dateA;
      });
      this.currentPage = 1;
    });
  }

  onClear() {
    this.searchName = '';
    this.searchMobile = '';
    this.searchLocation = '';
    this.searchReferral = '';
    this.searchLayoutName = '';
    this.searchAddress = '';
    this.currentPage = 1;
    this.loadData();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  downloadEnquiriesReport(): void {
    this.reportService.downloadEnquiriesReport(
      this.searchLocation,
      this.searchReferral,
      this.searchLayoutName,
      this.searchName,
      this.searchMobile,
      this.searchAddress
    ).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.toastr.error('Failed to download customers report');
      }
    });
  }

}


