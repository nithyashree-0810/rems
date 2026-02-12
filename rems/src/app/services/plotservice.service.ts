import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plot } from '../models/plot';

@Injectable({
  providedIn: 'root'
})
export class PlotserviceService {
  uploadPlotsExcel(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }

  private baseUrl = 'http://localhost:8080/api/plots';

  constructor(private http: HttpClient) { }

  // GET ALL PLOTS
  getPlots(): Observable<Plot[]> {
    return this.http.get<Plot[]>(`${this.baseUrl}`);
  }

  // DELETE PLOT
  deletePlot(layoutName: string, plotNo: string) {
    return this.http.delete(
      `${this.baseUrl}/delete/${layoutName}/${plotNo}`,
      { responseType: 'text' }
    );
  }

  // CREATE PLOT
  createPlot(newPlot: Plot): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, newPlot, { responseType: 'text' });
  }


  // UPDATE PLOT BY PLOT NO
  updatePlot(layoutName: string, plotNo: string, plot: Plot) {
    return this.http.put(`${this.baseUrl}/${layoutName}/${plotNo}`, plot);
  }


  // 🔹 Get all plots for a layout
  getPlotsByLayout(layoutName: string): Observable<Plot[]> {
    return this.http.get<Plot[]>(`${this.baseUrl}/search/${layoutName}`);
  }

  // 🔹 Get one plot by layout + plot number
  getPlotByLayoutAndPlotNo(layoutName: string, plotNo: string): Observable<Plot> {
    return this.http.get<Plot>(`${this.baseUrl}/${layoutName}/${plotNo}`);
  }

  updatePlotByLayoutAndPlotNo(layoutName: string, plotNo: string, plot: any) {
    return this.http.put(`${this.baseUrl}/${layoutName}/${plotNo}`, plot);
  }

  getPlotById(plotId: number | string): Observable<Plot> {
    return this.http.get<Plot>(`${this.baseUrl}/id/${plotId}`);
  }

  // ✅ MARK PLOT AS BOOKED
  markAsBooked(plotId: number | string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/mark-booked/${plotId}`,
      {},
      { responseType: 'text' }
    );
  }

  checkMobileName(mobile: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/check-mobile-name/${mobile}`, { responseType: 'text' });
  }

}
