import { Observable } from "rxjs";
import { GenericCURD } from "../../models/Generic.interface";
import { environment } from "../../environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class CityService implements GenericCURD<any> {

 private apiUrl = `${environment.apiUrl}/api/City/GetAllCities`;

constructor(private http: HttpClient) {}

  getAll():Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getById(id: number | string):Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  create(item: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/City/AddCity`, item);
  }
  update(id: number | string, item: any):Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}