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
    debugger
    return this.http.get<Enquiry>(`${this.baseUrl}/${mobileNo}`);
  }
// checkMobileExists(mobileNo: string): Observable<boolean> {
//   return this.http.get<boolean>(`${this.baseUrl}/exists/${mobileNo}`);
// }
  // createCustomer(enquiry: Enquiry): Observable<Enquiry> {
  //   debugger
  //   return this.http.post<Enquiry>(`${this.baseUrl}/create`, enquiry);
  // }
  createCustomer(enquiry: Enquiry) {
  return this.http.post<Enquiry>(`${this.baseUrl}`, enquiry); // ✅ correct
}
getAllCustomers(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.baseUrl}`);
  }
  updateCustomer(mobile: number, enquiry: Enquiry): Observable<Enquiry> {
    debugger
    return this.http.put<Enquiry>(`${this.baseUrl}/${mobile}`, enquiry);
  }

  // deleteCustomer(mobile: number): Observable<string> {
  //   debugger
  //   return this.http.delete<string>(`${this.baseUrl}/${mobile}`);
  // }
  deleteCustomer(mobileNo: number): Observable<string> {
  return this.http.delete<string>(`${this.baseUrl}/${mobileNo}`, { responseType: 'text' as 'json' });
}

 checkMobileExists(mobileNo: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-mobile/${mobileNo}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-email/${email}`);
  }
}
