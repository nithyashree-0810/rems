import { Component } from '@angular/core';
import { Layout } from '../../models/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutserviceService } from '../../services/layoutservice.service';

@Component({
  selector: 'app-edit-layout',
  standalone: false,
  templateUrl: './edit-layout.component.html',
  styleUrl: './edit-layout.component.css'
})
export class EditLayoutComponent {

   layout: Layout = new Layout();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutserviceService
  ) {}

  ngOnInit(): void {
    const layoutName = this.route.snapshot.paramMap.get('layoutName');
    if (layoutName) {
      this.layoutService.getLayoutByName(layoutName).subscribe(data => {
        this.layout = data;
      });
    }
  }

  onSubmit() {
     const layoutName = this.route.snapshot.paramMap.get('layoutName');
    if (layoutName) {
      this.layoutService.updateLayout(layoutName, this.layout).subscribe({
        next: () => {
          alert('Layout updated successfully!');
          this.router.navigate(['/layouts']);
        },
        error: err => console.error(err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/layouts']);
  }

}
