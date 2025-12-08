import { Component } from '@angular/core';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Router } from '@angular/router';
import { Layout } from '../../models/layout';

@Component({
  selector: 'app-view-layouts',
  standalone: false,
  templateUrl: './view-layouts.component.html',
  styleUrl: './view-layouts.component.css'
})
export class ViewLayoutsComponent {

  layouts: Layout[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private layoutService: LayoutserviceService, private router: Router) {}

  ngOnInit(): void {
    this.fetchLayouts(this.currentPage);
  }

  fetchLayouts(page: number) {
    debugger
  this.layoutService.getLayouts().subscribe((data: Layout[]) => {
    this.layouts = data;
    this.totalPages = Math.ceil(this.layouts.length / this.pageSize);
   const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.layouts = this.layouts.slice(startIndex, endIndex);
  });
}


  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage() { 
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1); 
  }

  nextPage() { 
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1); 
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchLayouts(this.currentPage);
  }

  navigateToCreate() {
     this.router.navigate(['/create-layout']);
     }
 viewLayout(layoutName: string) { 
  this.router.navigate(['/view-layout', layoutName]);
 }
  editLayout(layoutName: string) { 
    this.router.navigate(['/edit-layout', layoutName]);
   }
  createPlot(layoutName: string) {  
    this.router.navigate(['/create-plot', layoutName]);
  }
     deleteLayout(layoutName: string) {
  if (confirm('Are you sure you want to delete this layout?')) {
    debugger
    this.layoutService.deleteLayout(layoutName).subscribe({
      next: () => {
        alert('Layout deleted successfully!');
        this.fetchLayouts(this.currentPage); // refresh list
      },
      error: err => console.error(err)
    });
  }
}

     goHome() { 
      this.router.navigate(['/dashboard']); 
    
    }
}
