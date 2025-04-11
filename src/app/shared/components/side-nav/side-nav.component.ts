
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  @ViewChild('header') header!: ElementRef;
  @ViewChild('headerToggleBtn') headerToggleBtn!: ElementRef;

  constructor(
 
    private router: Router,
    private auth: AuthService
  ) {
   
  }


  headerToggle() {
    this.header.nativeElement.classList.toggle('header-show');
    this.headerToggleBtn.nativeElement.classList.toggle('bi-list');
    this.headerToggleBtn.nativeElement.classList.toggle('bi-x');
  }
  toggleDropdown(e: Event, element: HTMLElement) {
    e.preventDefault();
    element.parentElement?.classList.toggle('active');
    element.parentElement?.nextElementSibling?.classList.toggle(
      'dropdown-active'
    );
    e.stopImmediatePropagation();
  }



  logout() {
    this.auth.logout();
  }
}
