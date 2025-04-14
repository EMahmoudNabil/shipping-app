import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Courier } from '../../models/Courier.interface';


@Injectable({
  providedIn: 'root'
})
export class CourierService {
  private apiUrl = `${environment.apiUrl}/api/Auth/addCourier`;

  constructor(private http: HttpClient) {}
  
  create(courier: Courier): Observable<any> {
    const courierData = {
      email: courier.email,
      password: courier.password,
      fullName: courier.fullName,
      phoneNumber: courier.phoneNumber,
      address: courier.address,
      branchId: courier.branchId,
      deductionType: courier.deductionType,
      deductionCompanyFromOrder: courier.deductionCompanyFromOrder,
      specialCourierRegions: courier.specialCourierRegions.length > 0 ? courier.specialCourierRegions : null,
      roleName: "Courier" // Required by the backend
    };
    
    console.log('Sending data to API:', courierData);
    
    // Send the formatted data to the API
    return this.http.post<any>(this.apiUrl, courierData);
  }
}