import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // Name must be at least 2 characters
      name: ['', [Validators.required, Validators.minLength(2)]],
      // Email must be valid
      email: ['', [Validators.required, Validators.email]],
      // Password must be at least 6 characters
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe(
        res => {
          localStorage.setItem('token', res.token);
          // Redirect to the Login page after successful signup
          this.router.navigate(['/login']);
        },
        err => {
          // Check if the error message indicates that the user already exists
          if (
            err &&
            err.error &&
            err.error.message &&
            err.error.message.includes('User already exists')
          ) {
            this.errorMessage = 'User already exists.';
          } else {
            this.errorMessage = 'Signup failed. Please try again.';
          }
        }
      );
    }
  }
}
