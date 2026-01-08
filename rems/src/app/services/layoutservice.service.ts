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

  // ===================== SEARCH =====================
  searchLayouts(searchName: string, searchLocation: string): Observable<Layout[]> {
    const params: any = {};

    if (searchName && searchName.trim() !== '') {
      params['layoutName'] = searchName;
    }

    if (searchLocation && searchLocation.trim() !== '') {
      params['location'] = searchLocation;
    }

    return this.http.get<Layout[]>(`${this.apiUrl}/search`, { params });
  }

  // ===================== CREATE WITH PDF =====================
  createLayout(formData: FormData): Observable<Layout> {
    return this.http.post<Layout>(`${this.apiUrl}/createWithPdf`, formData);
  }

  // ===================== GET ALL =====================
  getLayouts(): Observable<Layout[]> {
    return this.http.get<Layout[]>(`${this.apiUrl}`);
  }

  // ===================== GET BY NAME =====================
  getLayoutByName(layoutName: string): Observable<Layout> {
    return this.http.get<Layout>(`${this.apiUrl}/${layoutName}`);
  }

  // ===================== UPDATE =====================
  updateLayout(layoutName: string, formData: FormData) {
  return this.http.put(
    `${this.apiUrl}/updateWithPdf/${layoutName}`,
    formData
  );
}



  // ===================== DELETE =====================
  deleteLayout(layoutName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${layoutName}`);
  }

}
