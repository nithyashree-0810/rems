import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enquiry } from '../models/enquiry';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/api/customer';

  constructor(private http: HttpClient) { }

  getCustomerByMobile(mobileNo: number): Observable<Enquiry> {
    return this.http.get<Enquiry>(`${this.baseUrl}/${mobileNo}`);
  }

  createCustomer(enquiry: Enquiry) {
    return this.http.post<Enquiry>(`${this.baseUrl}`, enquiry);
  }

  getAllCustomers(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.baseUrl}`);
  }

  updateCustomer(mobile: number, enquiry: Enquiry): Observable<Enquiry> {
    return this.http.put<Enquiry>(`${this.baseUrl}/${mobile}`, enquiry);
  }

  deleteCustomer(mobileNo: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${mobileNo}`, { responseType: 'text' as 'json' });
  }

  checkMobileExists(mobileNo: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-mobile/${mobileNo}`);
  }

  checkMobileName(mobileNo: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/check-mobile-name/${mobileNo}`, { responseType: 'text' });
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-email/${email}`);
  }

  // 🔍 SEARCH API
  searchCustomers(keyword: string): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.baseUrl}/search/${keyword}`);
  }

  uploadCustomerImage(mobileNo: number, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Enquiry>(`${this.baseUrl}/${mobileNo}/image`, form);
  }

  advancedSearch(layoutLocation?: string, referralName?: string, layoutName?: string, firstName?: string, mobileNo?: string, address?: string): Observable<Enquiry[]> {
    let params: any = {};
    if (layoutLocation) params.layoutLocation = layoutLocation;
    if (referralName) params.referralName = referralName;
    if (layoutName) params.layoutName = layoutName;
    if (firstName) params.firstName = firstName;
    if (mobileNo) params.mobileNo = mobileNo;
    if (address) params.address = address;
    return this.http.get<Enquiry[]>(`${this.baseUrl}/advanced-search`, { params });
  }
}
