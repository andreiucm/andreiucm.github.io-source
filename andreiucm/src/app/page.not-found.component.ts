import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink, ZardButtonComponent, ZardCardComponent],
    template: `
    <z-card class="not-found-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a z-button routerLink="/">Go to Home</a>
    </z-card>
    `,
    styles: `
    .not-found-container {
        max-width: 600px;
        margin: 4rem auto;
        text-align: center;
    }
    h1 {
        margin-bottom: 1rem;
        color: #d32f2f;
    }
    p {
        color: var(--muted-foreground);
        margin-bottom: 2rem;
    }
    `
})
export class NotFoundComponent {}
