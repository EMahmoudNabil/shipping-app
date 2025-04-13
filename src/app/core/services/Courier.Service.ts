import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Courier } from '../../models/Courier.interface';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  addCourier(courier: Courier): Observable<string> {
    // Corrected URL to include /Courier
    return this.http.post<string>(`${this.apiUrl}/Auth/AddCourier`, courier);
  }

  getBranches(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/Branch`);
  }
}