import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpecialCourierRegion } from '../../models/SpecialCourierRegion.interface';
import { GenericCURD } from '../../models/Generic.interface';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class SpecialCourierRegionService implements GenericCURD<SpecialCourierRegion> {
  private apiUrl = `${environment.apiUrl}/api/SpecialCourierRegion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SpecialCourierRegion[]> {
    return this.http.get<SpecialCourierRegion[]>(this.apiUrl);
  }

  getAllWithPagination(pageNumber: number, pageSize: number): Observable<SpecialCourierRegion[]> {
    const params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());
    return this.http.get<SpecialCourierRegion[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<SpecialCourierRegion> {
    return this.http.get<SpecialCourierRegion>(`${this.apiUrl}/${id}`);
  }

  create(specialCourierRegion: SpecialCourierRegion): Observable<SpecialCourierRegion> {
    return this.http.post<SpecialCourierRegion>(this.apiUrl, specialCourierRegion);
  }

  update(id: number, specialCourierRegion: SpecialCourierRegion): Observable<SpecialCourierRegion> {
    return this.http.put<SpecialCourierRegion>(`${this.apiUrl}/${id}`, specialCourierRegion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}