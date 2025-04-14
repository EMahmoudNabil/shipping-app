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



// دالة للحصول على بيانات المستخدم الحالي
getCurrentUser(): { id: string; email: string; fullName: string; merchantName?: string } | null {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// دالة للحصول على التوكن
getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// دالة للتحقق من حالة المصادقة
isAuthenticated(): boolean {
  return !!this.getAuthToken() && !this.isTokenExpired();
}

// دالة للتحقق من انتهاء صلاحية التوكن
private isTokenExpired(): boolean {
  const expiry = localStorage.getItem('authTokenExpiry');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
}




  login(payload: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${environment.apiUrl}/api/Auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authTokenExpiry', (Date.now() + response.expiresIn * 1000).toString());
          // حفظ بيانات المستخدم
          const userData = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
           

          };
          localStorage.setItem('userData', JSON.stringify(userData));
          })
);
    
  }


  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
  
}
