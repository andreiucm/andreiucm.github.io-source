import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
  template: `
    <z-card class="login-container" zTitle="Login" zDescription="Access your dashboard">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input z-input id="email" type="email" formControlName="email" required />
          @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
            <div class="error">
              Valid email is required
            </div>
          }
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input z-input id="password" type="password" formControlName="password" required />
          @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
            <div class="error">
              Password is required
            </div>
          }
        </div>
        <button z-button zFull type="submit" [zDisabled]="loginForm.invalid">Login</button>
      </form>
    </z-card>
    `,
  styles: `
    .login-container {
      max-width: 350px;
      margin: 5rem auto;
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
    .error {
      color: #d32f2f;
      font-size: 0.85rem;
      margin-top: 0.25rem;
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
