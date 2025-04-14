import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainSystemComponent } from './features/main-system/main-system.component';
import { RegionComponent } from './shared/components/region/region.component'; 
import { WeightSettingComponent } from './shared/components/weight-setting/weight-setting.component';
import { CityComponent } from './shared/components/city/city.component';
import { BranchComponent } from './shared/components/branch/branch.component';
import { ShippingTypeComponent } from './shared/components/shipping-type/shipping-type.component';

import { AddEmployeeComponent } from './shared/components/add-employee/add-employee.component';

import { MerchantService } from './core/services/Merchant.service';
import { MerchantComponent } from './shared/components/merchant/merchant.component';
import { CourierComponent } from './shared/components/courier/courier.component';
import { OrderReportComponent } from './shared/components/order-report/order-report.component';




export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },  
  { path: 'dashboard', component: MainSystemComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: MainSystemComponent, 
    children: [
      { path: '', component: MainSystemComponent }, 
      { path: 'regions', component: RegionComponent },
      { path: 'weightsettings', component: WeightSettingComponent }, 
      { path: 'cities', component: CityComponent },
      { path: 'addCourier', component: CourierComponent },
      {path:'branches',component:BranchComponent},
      {path:'Shippingtypes',component:ShippingTypeComponent},
      {path:'add-employee',component:AddEmployeeComponent },
      {path:'addMerchant',component:MerchantComponent},
      { path: 'order-reports', component: OrderReportComponent },

    ], canActivate: [AuthGuard]
  }
];
