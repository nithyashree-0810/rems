import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  activeDropdown: string | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {
    // 🔥 Close dropdown on every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeDropdown = null;
      }
    });
  }

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.activeDropdown = null;
    }
  }

  logout() {
    this.toastr.info('You have been logged out!');
    this.router.navigate(['/']);
  }
}
