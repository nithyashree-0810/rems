import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Layout } from '../models/layout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutserviceService {

  private apiUrl = 'http://localhost:8080/api/layouts';

  constructor(private http: HttpClient) {}

  createLayout(layout: Layout): Observable<Layout> {
    debugger
    return this.http.post<Layout>(`${this.apiUrl}/create`, layout);
  }

  getLayouts(): Observable<Layout[]> {
    debugger
  return this.http.get<Layout[]>(`${this.apiUrl}`);
}

 getLayoutByName(layoutName: string): Observable<Layout> {
    return this.http.get<Layout>(`${this.apiUrl}/${layoutName}`);
  }

  // Update layout
  updateLayout(layoutName: string, layout: Layout): Observable<Layout> {
    return this.http.put<Layout>(`${this.apiUrl}/${layoutName}`, layout);
  }

  // Delete layout
  deleteLayout(layoutName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${layoutName}`);
  }
}
