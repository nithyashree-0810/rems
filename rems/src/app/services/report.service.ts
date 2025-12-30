import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'http://localhost:8080/api/reports'; // Spring Boot base

  constructor(private http: HttpClient) { }

  downloadLayoutsReport(): Observable<Blob> {
    const headers = new HttpHeaders({
      // any auth headers go here
    });
    return this.http.get(`${this.baseUrl}/layouts`, {
      headers,
      responseType: 'blob' // IMPORTANT
    });
  }

  downloadBookingsReport(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/bookings`, {
      responseType: 'blob'
    });
  }

  downloadEnquiriesReport(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/enquiries`, {
      responseType: 'blob'
    });
  }

  downloadPlotsReport(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/plots`, {
      responseType: 'blob'
    });
  }
}
