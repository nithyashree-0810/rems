import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plot } from '../models/plot';

@Injectable({
  providedIn: 'root'
})
export class PlotserviceService {

  private baseUrl = 'http://localhost:8080/api/plots';

  constructor(private http: HttpClient) { }

  // GET ALL PLOTS
  getPlots(): Observable<Plot[]> {
    return this.http.get<Plot[]>(`${this.baseUrl}`);
  }

  // DELETE PLOT
  deletePlotByPlotNo(plotNo: string) {
    return this.http.delete(`${this.baseUrl}/${plotNo}`, { responseType: 'text' });
  }

  // CREATE PLOT
  createPlot(newPlot: Plot): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, newPlot, { responseType: 'text' });
  }

  // GET PLOT BY PLOT NO
  getPlotByPlotNo(plotNo: string): Observable<Plot> {
  return this.http.get<Plot>(`${this.baseUrl}/${plotNo}`);
}


  // UPDATE PLOT BY PLOT NO
  updatePlotByPlotNo(plotNo: any, plot: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${plotNo}`, plot);
  }

  // GET PLOT BY ID
  getPlotById(plotId: string): Observable<Plot> {
    return this.http.get<Plot>(`${this.baseUrl}/id/${plotId}`);
  }

  // 🔹 Get all plots for a layout
  getPlotsByLayout(layoutName: string): Observable<Plot[]> {
    return this.http.get<Plot[]>(`${this.baseUrl}/search/${layoutName}`);
  }

  // 🔹 Get one plot by layout + plot number
  getPlotByLayoutAndPlotNo(layoutName: string, plotNo: string): Observable<Plot> {
    return this.http.get<Plot>(`${this.baseUrl}/${layoutName}/${plotNo}`);
  }
}
