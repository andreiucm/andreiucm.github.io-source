import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from './user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (profile) {
        <div class="profile-container">
            <h2>{{ profile.name }}</h2>
            <p>{{ profile.email }}</p>
        </div>
    } @else {
        <p>Loading profile...</p>
    }
    `,
    styles: `
    .profile-container {
        max-width: 600px;
        margin: 2rem auto;
        background: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        text-align: center;
    }
    `
})
export class ProfileComponent {
    profile: User | null = null;

    constructor(route: ActivatedRoute) {
        const data = route.snapshot.data['profile'];
        this.profile = data ?? null;
    }
}
