import { Component } from '@angular/core';
import { LogoComponent } from "./logo.component";
import { RouterLink } from '@angular/router';

@Component({
	selector: "primary-side-bar",
    imports: [LogoComponent, RouterLink],
	template: `
    <app-logo></app-logo>
    <nav class="nav-menu">
        <a routerLink="/books" class="nav-item">Books</a>
    </nav>
    `,
	styles: `
    :host {
        display: block;
        background-color: white;
        padding: 1.5rem;
        border-right: 1px solid #e0e0e0;
        height: 100vh;
    }

    .nav-item {
        display: block;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
        border-radius: 0.5rem;
    }

    .nav-item:hover {
        background-color: #f5f5f5;
    }
    `,
})
export class PrimarySideBarComponent {}
