import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "./auth.service";

@Component({
	selector: "top-panel",
    standalone: true,
    imports: [CommonModule],
	template: `
    <div class="search-bar">
        <input type="search" placeholder="Search..." />
    </div>
    <div class="user-info">
        <span class="language">🇬🇧</span>
        <span class="notifications">🔔</span>
            <div class="dropdown">
                <span class="user-profile" (click)="toggleDropdown()">👤</span>
                @if (isDropdownOpen) {
                    <div class="dropdown-menu">
                        <button class="dropdown-item" (click)="logout()">Logout</button>
                    </div>
                }
            </div>
    </div>
    `,
	styles: `
    :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: white;
        border-bottom: 1px solid #e0e0e0;
    }

    .search-bar input {
        padding: 0.5rem 1rem;
        border: 1px solid #eee;
        border-radius: 6px;
        width: 300px;
        background-color: #f8f9fa;
    }

    .user-info {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .dropdown {
        cursor: pointer;
        position: relative;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 4px;
        padding: 0.5rem 0;
        min-width: 120px;
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background-color: #f8f9fa;
    }
    `,
})
export class TopPanelComponent {
    isDropdownOpen = false;

    constructor(private router: Router, private authService: AuthService) {}

    toggleDropdown() {
        this.isDropdownOpen = this.authService.hasToken() ? !this.isDropdownOpen : false;
    }

    logout() {
        this.authService.removeToken();
        this.isDropdownOpen = false;
        this.router.navigate(['/']);
    }
}
