import { Observable } from "rxjs";
import { BookingRequest } from "../models/booking-request";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/booking';

  constructor(private httpClient: HttpClient) {}

  createBooking(request: BookingRequest): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/createbooking`, request);
  }
}
