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
        background-color: var(--sidebar);
        padding: 1.5rem;
        border-right: 1px solid var(--sidebar-border);
        height: 100vh;
        color: var(--sidebar-foreground);
    }

    .nav-item {
        display: block;
        padding: 0.75rem 1rem;
        color: inherit;
        text-decoration: none;
        border-radius: 0.5rem;
    }

    .nav-item:hover {
        background-color: var(--sidebar-accent);
        color: var(--sidebar-accent-foreground);
    }
    `,
})
export class PrimarySideBarComponent {}
