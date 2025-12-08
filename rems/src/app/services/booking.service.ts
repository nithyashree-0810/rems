import { Injectable } from '@angular/core';
import { Booking } from '../models/bookings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private httpClient: HttpClient ){}
private apiUrl = 'http://localhost:8080/booking';
  

createBooking(booking: Booking):Observable<any> {
  debugger
   return this.httpClient.post(`${this.apiUrl}/createbooking`,booking)
 
  }
 

 
}
