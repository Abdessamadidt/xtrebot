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
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isVerified = false

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si l'utilisateur est déjà connecté, redirige vers /dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.isVerified = false
    this.startCountdown();

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

  getLastDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of current month
  }

  startCountdown() {
    const lastDayOfMonth = this.getLastDayOfMonth();

    setInterval(() => {
      const now = new Date();
      const timeDiff = lastDayOfMonth.getTime() - now.getTime();

      this.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (timeDiff <= 0) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      }
    }, 1000); // Update every second
  }
  
  verify(){
    this.isVerified = true
  }
}
