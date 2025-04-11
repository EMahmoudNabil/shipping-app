import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainSystemComponent } from './features/main-system/main-system.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // إعادة التوجيه إلى login إذا لم يكن هناك مسار آخر
  { path: 'login', component: LoginComponent },  // مسار صفحة تسجيل الدخول
  { path: 'dashboard', component: MainSystemComponent, canActivate: [AuthGuard] }
];
