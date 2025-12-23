import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rems';
  showHeaderFooter = false;

  constructor(private router: Router) {
    // Check initial route
    this.updateHeaderFooterVisibility(this.router.url);
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateHeaderFooterVisibility(event.url);
    });
  }

  private updateHeaderFooterVisibility(url: string): void {
    // Hide header and footer on login page
    this.showHeaderFooter = url !== '/' && url !== '';
  }
}
