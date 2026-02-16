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

    // check initial load
    this.updateHeaderFooterVisibility(this.router.url);

    // check on every route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderFooterVisibility(event.urlAfterRedirects);
      });
  }

  private updateHeaderFooterVisibility(url: string): void {

    // Normalize URL (remove query params)
    const cleanUrl = url.split('?')[0];

    // Hide header + footer on login, register, about, and forgot-password pages
    this.showHeaderFooter =
      !(cleanUrl === '/' ||
        cleanUrl === '/login' ||
        cleanUrl === '/register' ||
        cleanUrl === '/about' ||
        cleanUrl === '/forgot-password' ||
        url.startsWith('/auth/login'));
  }
}
