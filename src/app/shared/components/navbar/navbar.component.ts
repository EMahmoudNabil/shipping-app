import { Component, EventEmitter, Output } from '@angular/core';

import { RouterLink } from '@angular/router';
// import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() sidebarToggle = new EventEmitter();
  toggleSidebar(icon: HTMLElement) {
    this.sidebarToggle.emit();
  }
}
