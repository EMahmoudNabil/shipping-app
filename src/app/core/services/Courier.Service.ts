import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courier } from '../../models/Courier.interface';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private apiUrl = `${environment.apiUrl}/api/Courier`;

  constructor(private http: HttpClient) {}

  // Fetch couriers by branch
  getCourierByBranch(orderId: number): Observable<Courier[]> {
    const params = new HttpParams().set('OrderId', orderId.toString());
    return this.http.get<Courier[]>(`${this.apiUrl}/GetCourierByBranch`, { params });
  }

  // Fetch couriers by region
  getCourierByRegion(regionId: number): Observable<Courier[]> {
    const params = new HttpParams().set('RegionId', regionId.toString());
    return this.http.get<Courier[]>(`${this.apiUrl}/GetCourierByRegion`, { params });
  }
}