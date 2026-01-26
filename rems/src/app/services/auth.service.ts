import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) { }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    sendOtp(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/send-otp`, { email });
    }

    resetPassword(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data);
    }
}
