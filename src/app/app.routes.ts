import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // إعادة التوجيه إلى login إذا لم يكن هناك مسار آخر
  { path: 'login', component: LoginComponent },  // مسار صفحة تسجيل الدخول
];
