import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideConstruction,
  lucideFileDown,
  lucideFolderUp,
  lucideLayoutDashboard,
  lucideLibraryBig,
  lucideMessageCircle,
  lucideMessagesSquare,
  lucideScanText,
  lucideShoppingBasket,
  lucideSparkles,
  lucideSplit,
  lucideUserRound,
} from '@ng-icons/lucide';

interface NavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
  readonly underConstruction?: boolean;
}

interface NavigationGroup {
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

@Component({
  selector: 'primary-side-bar',
  imports: [NgIcon, RouterLink, RouterLinkActive],
  viewProviders: [
    provideIcons({
      lucideConstruction,
      lucideFileDown,
      lucideFolderUp,
      lucideLayoutDashboard,
      lucideLibraryBig,
      lucideMessageCircle,
      lucideMessagesSquare,
      lucideScanText,
      lucideShoppingBasket,
      lucideSparkles,
      lucideSplit,
      lucideUserRound,
    }),
  ],
  template: `
    <aside
      class="sticky top-0 flex h-dvh min-h-0 flex-col gap-5 border-r border-sidebar-border bg-sidebar px-3.5 py-4 text-sidebar-foreground max-md:static max-md:h-auto max-md:border-r-0 max-md:border-b"
    >
      <a
        routerLink="/private/home"
        class="flex items-center gap-2.5 rounded-lg px-1.5 text-inherit no-underline"
        aria-label="Andrei Workspace home"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground"
          aria-hidden="true"
        >
          A.
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold">Andrei Workspace</span>
          <span class="block text-xs text-muted-foreground">Private lab</span>
        </span>
      </a>

      <nav class="grid gap-4 max-md:grid-cols-2" aria-label="Private workspace">
        @for (group of navigationGroups; track group.label) {
          <section class="grid content-start gap-1">
            <h2 class="px-2.5 pb-1 text-[0.68rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              {{ group.label }}
            </h2>
            @for (item of group.items; track item.route) {
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-sidebar-primary text-sidebar-primary-foreground"
                [routerLinkActiveOptions]="{ exact: true }"
                ariaCurrentWhenActive="page"
                class="group grid min-w-0 grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <ng-icon [name]="item.icon" class="text-base" aria-hidden="true" />
                <span class="truncate">{{ item.label }}</span>
                @if (item.underConstruction) {
                  <ng-icon
                    name="lucideConstruction"
                    class="text-sm text-amber-600 group-[.bg-sidebar-primary]:text-workspace-highlight dark:text-amber-400"
                    aria-label="Under construction"
                  />
                }
              </a>
            }
          </section>
        }
      </nav>

      <div class="mt-auto border-t border-sidebar-border pt-3 max-md:hidden">
        <div class="flex items-center gap-2.5 px-1.5">
          <span
            class="grid size-8 place-items-center rounded-full bg-workspace-highlight text-xs font-semibold text-workspace-highlight-foreground"
            aria-hidden="true"
          >
            AM
          </span>
          <span>
            <span class="block text-sm font-medium">Andrei</span>
            <span class="block text-xs text-muted-foreground">Signed in</span>
          </span>
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimarySideBarComponent {
  protected readonly navigationGroups: readonly NavigationGroup[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Home', icon: 'lucideLayoutDashboard', route: '/private/home' },
        { label: 'Profile', icon: 'lucideUserRound', route: '/private/profile' },
        { label: 'Books', icon: 'lucideLibraryBig', route: '/private/books' },
        {
          label: 'Download CV',
          icon: 'lucideFileDown',
          route: '/private/cv',
          underConstruction: true,
        },
      ],
    },
    {
      label: 'Connect',
      items: [
        {
          label: 'Messages',
          icon: 'lucideMessageCircle',
          route: '/private/messages',
          underConstruction: true,
        },
        {
          label: 'Channels',
          icon: 'lucideMessagesSquare',
          route: '/private/channels',
          underConstruction: true,
        },
      ],
    },
    {
      label: 'Organize',
      items: [
        {
          label: 'Grocery lists',
          icon: 'lucideShoppingBasket',
          route: '/private/grocery',
          underConstruction: true,
        },
        {
          label: 'Files',
          icon: 'lucideFolderUp',
          route: '/private/files',
          underConstruction: true,
        },
      ],
    },
    {
      label: 'AI lab',
      items: [
        {
          label: 'Task pilot',
          icon: 'lucideSparkles',
          route: '/private/task-pilot',
          underConstruction: true,
        },
        {
          label: 'Document AI',
          icon: 'lucideScanText',
          route: '/private/document-ai',
          underConstruction: true,
        },
        {
          label: 'Reconcile',
          icon: 'lucideSplit',
          route: '/private/reconcile',
          underConstruction: true,
        },
      ],
    },
  ];
}
