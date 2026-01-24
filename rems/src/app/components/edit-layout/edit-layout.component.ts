import { Component } from '@angular/core';
import { Layout } from '../../models/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-layout',
  standalone: false,
  templateUrl: './edit-layout.component.html',
  styleUrl: './edit-layout.component.css'
})
export class EditLayoutComponent {

   layout: Layout = new Layout();
   selectedPdf: File | null = null;
   oldPdfUrl: string | null = null;
   currentPdfName: string | null = null; 
   originalLayoutName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutserviceService,
    private toastr: ToastrService
  ) {}

 ngOnInit(): void {
  const layoutName = this.route.snapshot.paramMap.get('layoutName');
  if (layoutName) {
    this.originalLayoutName = layoutName; // Store original name
    this.layoutService.getLayoutByName(layoutName).subscribe(data => {
      this.layout = data;

      // If the layout already has a PDF, set oldPdfUrl
      if (this.layout.pdfPath) {
        this.oldPdfUrl = `http://localhost:8080/api/layouts/pdf/${this.layout.layoutName}`;
      }
    });
  }
}



  onPdfSelected(event: any) {
  this.selectedPdf = event.target.files[0];
  console.log("Selected PDF:", this.selectedPdf);

  // Optional: hide old PDF preview when user selects new one
  if (this.selectedPdf) {
    this.oldPdfUrl = null;
  }
}

  onSubmit() {
  const originalLayoutName = this.route.snapshot.paramMap.get('layoutName');
  if (originalLayoutName) {

    // 1️⃣ Create FormData
    const formData = new FormData();

    // 2️⃣ Append the layout JSON as a Blob with key 'layoutData'
    formData.append('layoutData', new Blob([JSON.stringify(this.layout)], { type: 'application/json' }));

    // 3️⃣ Append the PDF file if user selected one, with key 'layoutPdf'
    if (this.selectedPdf) {
      formData.append('layoutPdf', this.selectedPdf);
    }

    // 4️⃣ Call your service
    this.layoutService.updateLayout(originalLayoutName, formData).subscribe({
      next: (updatedLayout: any) => {
        this.toastr.success('Layout updated successfully!');
        this.router.navigate(['/layouts']);
      },
      error: err => {
        console.error('Update error:', err);
        if (err.status === 404) {
          this.toastr.error('Layout not found!');
        } else if (err.error && err.error.message) {
          this.toastr.error('Update failed: ' + err.error.message);
        } else {
          this.toastr.error('Update failed! Please try again.');
        }
      }
    });
  }
}



  goBack() {
    this.router.navigate(['/layouts']);
  }

}
