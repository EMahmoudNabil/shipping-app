import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Region } from '../../models/Region.Interface ';
import { GenericCURD } from '../../models/Generic.interface';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService  implements GenericCURD<any> {

 private apiUrl = `${environment.apiUrl}/api/Region`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl);
  }

  getById(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.apiUrl}/${id}`);
  }

  create(region: Region): Observable<Region> {
    return this.http.post<Region>(this.apiUrl, region);
  }

  update(id: number, region: Region): Observable<Region> {
    return this.http.put<Region>(`${this.apiUrl}/${id}`, region);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
