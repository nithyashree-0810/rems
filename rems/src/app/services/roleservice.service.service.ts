import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleserviceServiceService {



  private baseUrl = 'http://localhost:8080/api/role';

  constructor(private http: HttpClient) { }

  createRole(role: Role) {
    return this.http.post<Role>(`${this.baseUrl}`, role);
  }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}`);
  }

  checkMobileExists(mobileNo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-mobile/${mobileNo}`);
  }

  checkMobileName(mobileNo: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/check-mobile-name/${mobileNo}`, { responseType: 'text' });
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-email/${email}`);
  }

  updateRole(roleId: number, role: Role) {
    return this.http.put(`${this.baseUrl}/update/${roleId}`,
      role
    );
  }

  getByRoleId(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/get/${roleId}`);
  }


  deleteRole(roleId: number) {
    return this.http.delete(
      `${this.baseUrl}/delete/${roleId}`,
      { responseType: 'text' }   // 🔥 IMPORTANT
    );
  }

  uploadRoleImage(roleId: number, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Role>(`${this.baseUrl}/${roleId}/image`, form);
  }
}
