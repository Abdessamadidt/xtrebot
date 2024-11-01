import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si l'utilisateur est déjà connecté, redirige vers /dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
  onLogin(): void {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields.',
      });
      return;
    }
  
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'An error occurred during login. Please try again.',
        });
      }
    });
  }
  
}
