// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment';
import { LoginDTO, LoginResponseDTO } from '../../models/Login.Interface';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(private http: HttpClient, private router: Router) {}
  // private apiUrl = `${environment.apiUrl}/Auth`;



  login(payload: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${environment.apiUrl}/api/Auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authTokenExpiry', (Date.now() + response.expiresIn * 1000).toString());
        const userData = {
          id: response.id,
          email: response.email,
          fullName: response.fullName,
        };
        // this.user.setUserData(userData); // ✳️ هنا فيه مشكلة بسيطة
      })
    );
  }


  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    // أي بيانات إضافية حابب تمسحها
    this.router.navigate(['/login']); // لو حابب تعيد التوجيه بعد تسجيل الخروج
  }
  
}
