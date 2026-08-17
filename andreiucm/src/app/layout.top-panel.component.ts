import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideConstruction,
  lucideFileText,
  lucideHash,
  lucideLanguages,
  lucideLogOut,
  lucideMessageCircle,
  lucideSearch,
  lucideShoppingBasket,
  lucideSunMoon,
  lucideUserCircle,
} from '@ng-icons/lucide';

import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';

@Component({
  selector: 'top-panel',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDropdownDirective,
    ZardDropdownMenuContentComponent,
    ZardDropdownMenuItemComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
  ],
  viewProviders: [
    provideIcons({
      lucideBookOpen,
      lucideConstruction,
      lucideFileText,
      lucideHash,
      lucideLanguages,
      lucideLogOut,
      lucideMessageCircle,
      lucideSearch,
      lucideShoppingBasket,
      lucideSunMoon,
      lucideUserCircle,
    }),
  ],
  template: `
    <header
      class="sticky top-0 z-20 flex min-h-17 items-center justify-between gap-3 border-b bg-card/95 px-5 py-3 backdrop-blur max-sm:flex-col max-sm:items-stretch max-sm:px-4"
    >
      <button
        z-button
        zType="outline"
        zSize="lg"
        type="button"
        class="min-w-0 flex-1 justify-start bg-card shadow-sm sm:max-w-2xl"
        aria-label="Preview workspace search"
        zPopover
        [zContent]="searchPreview"
        zPlacement="bottom"
      >
        <ng-icon name="lucideSearch" aria-hidden="true" />
        <span class="truncate text-muted-foreground">Search files, chats, channels, books, lists…</span>
        <span class="ml-auto inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
          <ng-icon name="lucideConstruction" aria-hidden="true" />
          <span class="sr-only sm:not-sr-only">Build</span>
        </span>
        <kbd class="hidden rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">⌘ K</kbd>
      </button>

      <div class="flex shrink-0 items-center gap-2 max-sm:justify-end">
        <button
          z-button
          zType="outline"
          zSize="lg"
          type="button"
          (click)="toggleLanguage()"
          aria-label="Preview language switch"
        >
          <ng-icon name="lucideLanguages" aria-hidden="true" />
          {{ language() }}
          <ng-icon name="lucideConstruction" class="text-amber-600 dark:text-amber-400" aria-label="Under construction" />
        </button>
        <button
          z-button
          zType="outline"
          zSize="lg"
          type="button"
          (click)="themeService.toggleDarkMode()"
          [attr.aria-label]="themeActionLabel()"
        >
          <ng-icon name="lucideSunMoon" aria-hidden="true" />
          <span class="hidden sm:inline">{{ themeLabel() }}</span>
          <ng-icon name="lucideConstruction" class="text-amber-600 dark:text-amber-400" aria-label="Under construction" />
        </button>
        <button
          z-button
          zType="ghost"
          zSize="icon-lg"
          type="button"
          z-dropdown
          aria-label="Open user menu"
          [zDropdownMenu]="userMenu"
        >
          <ng-icon name="lucideUserCircle" />
        </button>

        <z-dropdown-menu-content #userMenu="zDropdownMenuContent" class="w-52">
          <div class="px-2 py-1.5">
            <p class="m-0 text-sm font-medium">Andrei Workspace</p>
            <p class="mt-0.5 mb-0 text-xs text-muted-foreground">Private account</p>
          </div>
          @if (authService.hasToken()) {
            <z-dropdown-menu-item (click)="logout()">
              <span class="inline-flex items-center gap-2"><ng-icon name="lucideLogOut" /> Logout</span>
            </z-dropdown-menu-item>
          }
        </z-dropdown-menu-content>

        <ng-template #searchPreview>
          <z-popover class="w-[min(34rem,calc(100vw-2rem))] p-0">
            <div class="border-b px-4 py-3">
              <p class="m-0 text-sm font-medium">Workspace search preview</p>
              <p class="mt-1 mb-0 text-xs text-muted-foreground">
                Fuzzy search will combine private results without mixing their source context.
              </p>
            </div>
            <div class="grid gap-1 p-2">
              @for (result of searchResults; track result.label) {
                <div class="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted">
                  <span class="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <ng-icon [name]="result.icon" aria-hidden="true" />
                  </span>
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-medium">{{ result.label }}</span>
                    <span class="block truncate text-xs text-muted-foreground">{{ result.context }}</span>
                  </span>
                  <span class="text-xs text-muted-foreground">{{ result.type }}</span>
                </div>
              }
            </div>
            <div class="flex items-center gap-1 border-t px-4 py-2 text-xs text-amber-600 dark:text-amber-400">
              <ng-icon name="lucideConstruction" /> Search is under construction
            </div>
          </z-popover>
        </ng-template>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPanelComponent {
  protected readonly language = signal<'EN' | 'RO'>('EN');
  protected readonly themeLabel = computed(() => (this.themeService.isDarkMode() ? 'Dark' : 'Light'));
  protected readonly themeActionLabel = computed(() =>
    this.themeService.isDarkMode() ? 'Switch to light theme' : 'Switch to dark theme',
  );
  protected readonly searchResults = [
    { icon: 'lucideFileText', label: 'Rental agreement.pdf', context: 'Files · document', type: 'File' },
    { icon: 'lucideMessageCircle', label: 'Share the grocery list…', context: 'Conversation with Maria', type: 'Chat' },
    { icon: 'lucideHash', label: '# family-plans', context: 'Channel · 4 members', type: 'Channel' },
    { icon: 'lucideBookOpen', label: 'Angular architecture notes', context: 'Saved book entry', type: 'Book' },
    { icon: 'lucideShoppingBasket', label: 'Oat milk', context: 'Family groceries · open item', type: 'List' },
  ] as const;

  constructor(
    private readonly router: Router,
    protected readonly authService: AuthService,
    protected readonly themeService: ThemeService,
  ) {}

  protected toggleLanguage(): void {
    this.language.update((language) => (language === 'EN' ? 'RO' : 'EN'));
  }

  protected logout(): void {
    this.authService.removeToken();
    void this.router.navigate(['/']);
  }
}
