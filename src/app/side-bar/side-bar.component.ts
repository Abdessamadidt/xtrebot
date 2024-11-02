import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isSidebarVisible: boolean = true;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private sideBarService: SidebarService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUsername() === 'admin';
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sideBarService.toggleSideBar(this.isSidebarVisible); // Notify the service
  }

  logOut(): void {
    this.isAdmin = false;
    this.isLoggedIn = false;
    this.authService.logout();
  }
}
