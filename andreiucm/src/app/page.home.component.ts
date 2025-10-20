import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User, UserService } from './user.service'; // Import the USERService
import { AuthService } from "./auth.service";

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      @if (authService.hasToken()) {
        @if(user()?.email) {
          <h1>Welcome, {{ user()?.email }}!</h1>
        } @else {
          <button (click)="loadDetails()">Load User Details</button>
        }
        <p>This is your dashboard home page.</p>
      } @else {
        <h1>Welcome to the Dashboard App!</h1>
        <p>This app helps you manage your data and workflow efficiently.</p>
        <div class="auth-links">
          <a routerLink="/login">Login</a>
          <a routerLink="/signup">Sign Up</a>
        </div>
      }
    </div>
  `,
  styles: `
    .home-container {
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
      max-width: 600px;
      margin: 2rem auto;
      text-align: center;
    }
    h1 {
      margin-bottom: 1rem;
    }
    p {
      color: #666;
    }
    .auth-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .auth-links a {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      border: 1px solid #1976d2;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .auth-links a:hover {
      background: #1976d2;
      color: white;
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
