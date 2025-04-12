import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainSystemComponent } from './features/main-system/main-system.component';
import { AddCityComponent } from './shared/components/add-city/add-city.component';
import { RegionComponent } from './shared/components/region/region.component';
import { BranchComponent } from './shared/components/branch/branch.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // إعادة التوجيه إلى login إذا لم يكن هناك مسار آخر
  { path: 'login', component: LoginComponent },  // مسار صفحة تسجيل الدخول
  { path: 'dashboard', component: MainSystemComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: MainSystemComponent, // المكون الرئيسي الذي يحتوي على الهيكل
    children: [
      { path: '', component: MainSystemComponent }, // الصفحة الرئيسية
      { path: 'regions', component: RegionComponent }, // سيظهر داخل الـ main
      {path:'branches',component:BranchComponent}

    ], canActivate: [AuthGuard]
  }

];
