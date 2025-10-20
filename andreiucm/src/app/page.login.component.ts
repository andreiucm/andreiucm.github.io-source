import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <h2>Login</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" required />
          <div class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            Valid email is required
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" required />
          <div class="error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            Password is required
          </div>
        </div>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  `,
  styles: `
    .login-container {
      max-width: 350px;
      margin: 5rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
    }
    .error {
      color: #d32f2f;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:disabled {
      background: #b0b0b0;
      cursor: not-allowed;
    }
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.logIn({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
        .subscribe({
          next: (data) => {
            this.authService.setToken(data.token);
            this.router.navigate(['/']);
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
