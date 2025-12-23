import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {

   private apiUrl = 'http://localhost:8080/api/layouts';

  constructor(private http: HttpClient) {}

  getDashboardCounts(type: 'admin' | 'sales' | 'manager' = 'admin'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard-counts`, {
      params: { type }
    });
  }
}
