import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  activeDropdown: string | null = null;

  constructor(private router: Router,private reportService:ReportService) {}

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.activeDropdown = null;
    }
  }

  downloadLayoutsReport() {
    this.reportService.downloadLayoutsReport().subscribe({
      next: (blob: Blob) => {
        // create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'layouts.csv'; // filename suggested to browser
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Report download failed', err);
        alert('Could not download report. Check console for details.');
      }
    });
  }

  logout() {
    alert('You have been logged out!');
    this.router.navigate(['/']);
  }

}
