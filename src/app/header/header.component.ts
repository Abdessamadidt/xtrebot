import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isSideBarVisible: boolean = false;

  constructor(private sidebarService: SidebarService,private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sidebarService.isSideBarOpen$.subscribe(isOpen => {
      this.isSideBarVisible = isOpen;
      this.isLoggedIn = this.authService.isLoggedIn();

    });
  }



  onLogout(): void {
    this.authService.logout(); // Déconnecte l'utilisateur
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Redirige vers la page de connexion
      }
}
