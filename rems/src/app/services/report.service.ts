import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../models/bookings';
import { Layout } from '../models/layout';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'http://localhost:8080/api/reports'; // Spring Boot base

  constructor(private http: HttpClient) { }

  downloadLayoutsReport(filteredLayouts: Layout[]): Observable<Blob> {
  const headers = new HttpHeaders({
    // any auth headers go here
  });

  return this.http.post(
    `${this.baseUrl}/layouts/report`,
    filteredLayouts, // send filtered layouts from UI
    { headers, responseType: 'blob' } // must be outside the body
  );
}


 downloadBookingsReport(bookings: Booking[]): Observable<Blob> {
    return this.http.post(
      `${this.baseUrl}/bookings`,
      bookings,
      { responseType: 'blob' }
    );
  }


  downloadEnquiriesReport(data: any[]): Observable<Blob> {
  return this.http.post(
    `${this.baseUrl}/enquiries`,
    data,
    { responseType: 'blob' }
  );
}

  downloadPlotsReport(data: any[]): Observable<Blob> {
  return this.http.post(
    `${this.baseUrl}/plots`,
    data,
    { responseType: 'blob' }
  );
}

downloadRoleReport(data: any[]) {
  return this.http.post(
    'http://localhost:8080/api/reports/roles',
    data,
    { responseType: 'blob' }
  );
}




}
