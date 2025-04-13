import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainSystemComponent } from './features/main-system/main-system.component';
import { RegionComponent } from './shared/components/region/region.component'; 
import { WeightSettingComponent } from './shared/components/weight-setting/weight-setting.component';
import { SpecialCourierRegionComponent } from './shared/components/special-courier-region/special-courier-region.component';
import { CityComponent } from './shared/components/city/city.component';
import { BranchComponent } from './shared/components/branch/branch.component';
import { ShippingTypeComponent } from './shared/components/shipping-type/shipping-type.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // إعادة التوجيه إلى login إذا لم يكن هناك مسار آخر
  { path: 'login', component: LoginComponent },  // مسار صفحة تسجيل الدخول
  { path: 'dashboard', component: MainSystemComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: MainSystemComponent, // المكون الرئيسي الذي يحتوي على الهيكل
    children: [
      { path: '', component: MainSystemComponent }, // الصفحة الرئيسية
      { path: 'regions', component: RegionComponent }, // سيظهر داخل الـ main HEAD
      { path: 'weightsettings', component: WeightSettingComponent }, 
      { path: 'specialcourierregions', component: SpecialCourierRegionComponent },
      { path: 'cities', component: CityComponent },

      {path:'branches',component:BranchComponent},
      {path:'Shippingtypes',component:ShippingTypeComponent}
    ], canActivate: [AuthGuard]
  }
];
