import { Component } from '@angular/core';
import { Layout } from '../../models/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutserviceService } from '../../services/layoutservice.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-layout',
  standalone: false,
  templateUrl: './view-layout.component.html',
  styleUrl: './view-layout.component.css'
})
export class ViewLayoutComponent {

  layout: Layout = new Layout();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutserviceService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const layoutName = this.route.snapshot.paramMap.get('layoutName');
    if (layoutName) {
      this.layoutService.getLayoutByName(layoutName).subscribe(data => {
        this.layout = data;
      });
    }
  }

  goBack() {
    this.location.back();
  }

  viewLayoutPdf() {
    const url = `http://localhost:8080/api/layouts/pdf/${this.layout.layoutName}`;
    window.open(url, "_blank");
  }

}
