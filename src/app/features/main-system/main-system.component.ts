import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
import { SideNavComponent } from "../../shared/components/side-nav/side-nav.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { AddCityComponent } from '../../shared/components/add-city/add-city.component';
import { RegionComponent } from "../../shared/components/region/region.component";

@Component({
  selector: 'app-main-system',
  imports: [RouterOutlet, SideNavComponent, LoadingComponent, NavbarComponent, CommonModule],
  templateUrl: './main-system.component.html',
  styleUrl: './main-system.component.css'
})
export class MainSystemComponent {
  constructor(
   
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  reloadCities() {
    console.log('reloadCities called!');
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  sidebarActive: boolean = false;
  @ViewChild(SideNavComponent) sideNav?: SideNavComponent;
 
  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
    this.sideNav?.headerToggle();
  }

  @ViewChild(AddCityComponent) addCityComponent!: AddCityComponent;
  onAddCityClick() {
    this.addCityComponent.addModal(0); // أو تمرر regionId حسب ما تحب
  }


}
