import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/bookings';
import { BookingRequest } from '../models/booking-request';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/booking';

  constructor(private httpClient: HttpClient) {}

  // CREATE Booking
  createBooking(request: BookingRequest): Observable<Booking> {
    return this.httpClient.post<Booking>(`${this.apiUrl}/createbooking`, request);
  }

  // GET all bookings
  getAllBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/all`);
  }

  // GET booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.httpClient.get<Booking>(`${this.apiUrl}/get/${id}`);
  }

  updateBooking(id: number, booking: Partial<Booking>) {
  return this.httpClient.put(
    `${this.apiUrl}/update/${id}`,
    booking
  );
}


  // DELETE booking
  deleteBooking(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/delete/${id}`);
  }

  // ================= HISTORY METHODS =================

  // Get latest active bookings per plot (for main list view)
  getLatestActiveBookingsPerPlot(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/latest-per-plot`);
  }

  // Get all active bookings
  getAllActiveBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/active`);
  }

  // Get booking history for a specific plot
  getBookingHistoryByPlot(plotId: number): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/history/plot/${plotId}`);
  }

  // Get booking history for a specific layout
  getBookingHistoryByLayout(layoutId: number): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/history/layout/${layoutId}`);
  }

  // Get latest active booking for a specific plot
  getLatestActiveBookingByPlot(plotId: number): Observable<Booking> {
    return this.httpClient.get<Booking>(`${this.apiUrl}/latest/plot/${plotId}`);
  }

  // Soft delete (cancel) booking
  softDeleteBooking(id: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/soft-delete/${id}`, {});
  }
}
