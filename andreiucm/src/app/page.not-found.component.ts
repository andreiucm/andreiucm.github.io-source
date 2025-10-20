import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="not-found-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a routerLink="/">Go to Home</a>
    </div>
    `,
    styles: `
    .not-found-container {
        padding: 2rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        max-width: 600px;
        margin: 4rem auto;
        text-align: center;
    }
    h1 {
        margin-bottom: 1rem;
        color: #d32f2f;
    }
    p {
        color: #666;
        margin-bottom: 2rem;
    }
    a {
        color: #1976d2;
        text-decoration: underline;
        font-weight: 500;
    }
    `
})
export class NotFoundComponent {}
