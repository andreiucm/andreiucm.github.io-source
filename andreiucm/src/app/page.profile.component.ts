import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { User } from './user.service';
import { ZardCardComponent } from '@/shared/components/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ZardCardComponent],
  template: `
    @if (profile) {
        <z-card class="profile-container" zTitle="Profile">
            <h2>{{ profile.name }}</h2>
            <p>{{ profile.email }}</p>
        </z-card>
    } @else {
        <p>Loading profile...</p>
    }
    `,
    styles: `
    .profile-container {
        max-width: 600px;
        margin: 2rem auto;
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
