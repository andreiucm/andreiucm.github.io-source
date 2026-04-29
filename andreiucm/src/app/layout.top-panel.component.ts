import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideLanguages, lucideUserCircle } from '@ng-icons/lucide';

import { AuthService } from "./auth.service";
import { ThemeService } from "./theme.service";
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';
import { ZardSwitchComponent } from '@/shared/components/switch';

@Component({
	selector: "top-panel",
    standalone: true,
    imports: [
        ZardButtonComponent,
        ZardDropdownDirective,
        ZardDropdownMenuContentComponent,
        ZardDropdownMenuItemComponent,
        ZardInputDirective,
        ZardPopoverComponent,
        ZardPopoverDirective,
        ZardSwitchComponent,
        NgIcon,
    ],
    viewProviders: [provideIcons({ lucideBell, lucideLanguages, lucideUserCircle })],
	template: `
    <div class="search-bar">
        <input z-input type="search" placeholder="Search..." />
    </div>
    <div class="user-info">
        <button z-button zType="ghost" zSize="icon" aria-label="Language">
            <ng-icon name="lucideLanguages" />
        </button>
        <button
            z-button
            zType="ghost"
            zSize="icon"
            class="notification-trigger"
            aria-label="Notifications"
            zPopover
            [zContent]="notificationsPopover"
            zPlacement="bottom"
        >
            <ng-icon name="lucideBell" />
            @if (unreadNotificationCount > 0) {
                <span class="notification-badge">{{ unreadNotificationCount }}</span>
            }
        </button>
        <button
            z-button
            zType="ghost"
            zSize="icon"
            z-dropdown
            aria-label="Open user menu"
            [zDropdownMenu]="userMenu"
        >
            <ng-icon name="lucideUserCircle" />
        </button>

        <z-dropdown-menu-content #userMenu="zDropdownMenuContent" class="w-56">
            <div class="menu-section">
                <p class="menu-label">Settings</p>
                <div class="theme-row">
                    <span>Dark mode</span>
                    <z-switch
                        zSize="sm"
                        [zChecked]="themeService.isDarkMode()"
                        (zCheckedChange)="themeService.setDarkMode($event)"
                    />
                </div>
            </div>

            @if (authService.hasToken()) {
                <z-dropdown-menu-item (click)="logout()">Logout</z-dropdown-menu-item>
            }
        </z-dropdown-menu-content>

        <ng-template #notificationsPopover>
            <z-popover class="notifications-popover">
                <div class="notifications-header">
                    <div>
                        <p class="notifications-title">Notifications</p>
                        <p class="notifications-subtitle">{{ unreadNotificationCount }} unread updates</p>
                    </div>
                    <button z-button zType="ghost" zSize="sm" type="button">Mark all read</button>
                </div>

                <div class="notifications-list">
                    @for (notification of notifications; track notification.id) {
                        <article class="notification-item" [class.unread]="!notification.read">
                            <span class="notification-dot" aria-hidden="true"></span>
                            <div class="notification-copy">
                                <p class="notification-title">{{ notification.title }}</p>
                                <p class="notification-message">{{ notification.message }}</p>
                                <time class="notification-time">{{ notification.time }}</time>
                            </div>
                        </article>
                    }
                </div>
            </z-popover>
        </ng-template>
    </div>
    `,
	styles: `
    :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: var(--card);
        border-bottom: 1px solid var(--border);
    }

    .search-bar input {
        width: 300px;
    }

    .user-info {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .notification-trigger {
        position: relative;
    }

    .notification-badge {
        position: absolute;
        top: 0.125rem;
        right: 0.125rem;
        display: grid;
        min-width: 1rem;
        height: 1rem;
        place-items: center;
        border-radius: 999px;
        background: var(--destructive);
        color: white;
        font-size: 0.625rem;
        font-weight: 700;
        line-height: 1;
    }

    .notifications-popover {
        width: 22rem;
        padding: 0;
    }

    .notifications-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border);
    }

    .notifications-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 700;
    }

    .notifications-subtitle {
        margin: 0.25rem 0 0;
        color: var(--muted-foreground);
        font-size: 0.8rem;
    }

    .notifications-list {
        display: grid;
        max-height: 20rem;
        overflow-y: auto;
    }

    .notification-item {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-bottom: 1px solid var(--border);
    }

    .notification-item:last-child {
        border-bottom: 0;
    }

    .notification-item.unread {
        background: var(--accent);
    }

    .notification-dot {
        width: 0.5rem;
        height: 0.5rem;
        margin-top: 0.375rem;
        border-radius: 999px;
        background: transparent;
    }

    .notification-item.unread .notification-dot {
        background: var(--primary);
    }

    .notification-copy {
        min-width: 0;
    }

    .notification-title {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 650;
    }

    .notification-message {
        margin: 0.25rem 0 0;
        color: var(--muted-foreground);
        font-size: 0.8rem;
        line-height: 1.4;
    }

    .notification-time {
        display: block;
        margin-top: 0.5rem;
        color: var(--muted-foreground);
        font-size: 0.75rem;
    }

    .menu-section {
        padding: 0.375rem 0.5rem;
    }

    .menu-label {
        margin: 0 0 0.5rem;
        color: var(--muted-foreground);
        font-size: 0.75rem;
        font-weight: 600;
    }

    .theme-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.875rem;
    }
    `,
})
export class TopPanelComponent {
    protected readonly notifications = [
        {
            id: 1,
            title: 'Profile checked',
            message: 'Your profile data was loaded successfully.',
            time: '2 min ago',
            read: false,
        },
        {
            id: 2,
            title: 'New book saved',
            message: 'Clean Architecture was added to the books list.',
            time: '18 min ago',
            read: false,
        },
        {
            id: 3,
            title: 'Deployment ready',
            message: 'The latest Angular build completed without errors.',
            time: 'Today, 09:20',
            read: true,
        },
    ];

    protected readonly unreadNotificationCount = this.notifications.filter(notification => !notification.read).length;

    constructor(
        private router: Router,
        protected authService: AuthService,
        protected themeService: ThemeService
    ) {}

    logout() {
        this.authService.removeToken();
        this.router.navigate(['/']);
    }
}
