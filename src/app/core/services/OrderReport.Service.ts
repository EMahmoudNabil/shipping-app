import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { OrderReport } from '../../models/OrderReport.Interface';

@Injectable({
  providedIn: 'root',
})
export class OrderReportService {
  private apiUrl = `${environment.apiUrl}/api/OrderReport`;

  constructor(private http: HttpClient) {}

  getAllWithPagination(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllByPramter`, { params });
  }

  update(id: number, orderReport: OrderReport): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orderReport);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}