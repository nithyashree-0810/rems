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


  downloadEnquiriesReport(layoutLocation?: string, referralName?: string, layoutName?: string, firstName?: string, mobileNo?: string, address?: string): Observable<Blob> {
    let params: any = {};
    if (layoutLocation) params.layoutLocation = layoutLocation;
    if (referralName) params.referralName = referralName;
    if (layoutName) params.layoutName = layoutName;
    if (firstName) params.firstName = firstName;
    if (mobileNo) params.mobileNo = mobileNo;
    if (address) params.address = address;

    return this.http.get(`${this.baseUrl}/enquiries`, {
      params,
      responseType: 'blob'
    });
  }

  downloadEnquiriesExcelReport(layoutLocation?: string, referralName?: string, layoutName?: string, firstName?: string, mobileNo?: string, address?: string): Observable<Blob> {
    let params: any = {};
    if (layoutLocation) params.layoutLocation = layoutLocation;
    if (referralName) params.referralName = referralName;
    if (layoutName) params.layoutName = layoutName;
    if (firstName) params.firstName = firstName;
    if (mobileNo) params.mobileNo = mobileNo;
    if (address) params.address = address;

    return this.http.get(`${this.baseUrl}/enquiries/excel`, {
      params,
      responseType: 'blob'
    });
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
