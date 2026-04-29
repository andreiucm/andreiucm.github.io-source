import { Component, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { User, UserService } from './user.service'; // Import the USERService
import { AuthService } from "./auth.service";
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';

@Component({
  selector: 'home',
  standalone: true,
  imports: [RouterLink, ZardButtonComponent, ZardCardComponent],
  template: `
    <z-card class="home-container">
      @if (authService.hasToken()) {
        @if(user()?.email) {
          <h1>Welcome, {{ user()?.email }}!</h1>
        } @else {
          <button z-button (click)="loadDetails()">Load User Details</button>
        }
        <p>This is your dashboard home page.</p>
      } @else {
        <h1>Welcome to the Dashboard App!</h1>
        <p>This app helps you manage your data and workflow efficiently.</p>
        <div class="auth-links">
          <a z-button routerLink="/login">Login</a>
          <a z-button zType="outline" routerLink="/signup">Sign Up</a>
        </div>
      }
    </z-card>
  `,
  styles: `
    .home-container {
      max-width: 600px;
      margin: 2rem auto;
      text-align: center;
    }
    h1 {
      margin-bottom: 1rem;
    }
    p {
      color: var(--muted-foreground);
    }
    .auth-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
  `
})
export class HomeComponent {
  user = signal<User|null>(null);
  constructor(private userService: UserService, protected authService: AuthService) {
}

  loadDetails() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user.set(user);
      }
    })
  }
}
