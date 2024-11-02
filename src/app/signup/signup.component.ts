import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isVerified = false;

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });

  }

  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // Submit form data
  onSubmit() {
    if (this.signupForm.valid) {
      const { email, firstName, lastName, password } = this.signupForm.value;

      this.authService.signup({ email, firstName, lastName, password }).subscribe(
        (response) => {
          Swal.fire({
            title: '',
            text: 'You have successfully signed up!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Redirect to dashboard after alert confirmation
          this.router.navigate(['/login']);
          });
        },
        (error) => {
          // Check for 409 error status
          if (error.status === 409) {
            const errorMessage = error.error?.error || 'Email or Username already exists.';
            Swal.fire({
              title: 'Sign Up Failed',
              text: errorMessage, // Show specific error message
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            // Handle other error statuses
            const errorMessage = error.error?.message || 'An unknown error occurred.';
            Swal.fire({
              title: 'Sign Up Failed',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    }
  }


  ngOnInit(): void {
    this.startCountdown();
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