import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideChevronRight,
  lucideConstruction,
  lucideFolderUp,
  lucideLibraryBig,
  lucideMessageCircle,
  lucideShoppingBasket,
  lucideSparkles,
  lucideUserRound,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'app-workspace-home',
  imports: [FormField, NgIcon, RouterLink, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      lucideChevronRight,
      lucideConstruction,
      lucideFolderUp,
      lucideLibraryBig,
      lucideMessageCircle,
      lucideShoppingBasket,
      lucideSparkles,
      lucideUserRound,
    }),
  ],
  template: `
    <div class="mx-auto grid max-w-6xl gap-5">
      <header class="flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <p class="workspace-kicker">Private workspace</p>
          <h1 class="mt-1 text-3xl font-semibold tracking-tight">Good morning, Andrei.</h1>
          <p class="mt-2 text-muted-foreground">
            One calm place for people, knowledge, shared lists, and assisted work.
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <ng-icon name="lucideConstruction" aria-hidden="true" /> Prototype roadmap
        </span>
      </header>

      <z-card
        class="workspace-hero-card relative overflow-hidden border-workspace-highlight/70 py-0 [&_[data-slot=card-content]]:p-6"
      >
        <div class="relative z-10 grid grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] gap-6 max-lg:grid-cols-1">
          <section class="grid content-center gap-3" aria-labelledby="task-pilot-heading">
            <p class="workspace-kicker">AI task pilot · under construction</p>
            <h2 id="task-pilot-heading" class="text-xl font-semibold">Start with an outcome, not an app.</h2>
            <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
              Describe what you need. The pilot builds a checklist, gathers options, and pauses before every booking,
              payment, or message.
            </p>

            <form
              class="mt-1 flex items-center gap-2 rounded-xl border bg-background p-2 pl-3 shadow-sm max-sm:flex-col max-sm:items-stretch"
              (submit)="planTask(); $event.preventDefault()"
            >
              <ng-icon name="lucideSparkles" class="shrink-0 max-sm:hidden" aria-hidden="true" />
              <label class="sr-only" for="task-request">Describe a task</label>
              <input
                z-input
                zBorderless
                id="task-request"
                class="min-w-0 flex-1 bg-transparent"
                [formField]="taskForm.request"
              />
              <button
                z-button
                zSize="lg"
                type="submit"
                class="shrink-0 max-sm:w-full"
                [zDisabled]="taskForm().invalid()"
              >
                Plan task <ng-icon name="lucideArrowRight" aria-hidden="true" />
              </button>
            </form>

            <div class="flex flex-wrap gap-2" aria-label="Task examples">
              @for (example of taskExamples; track example.label) {
                <a z-button zType="outline" zSize="sm" [routerLink]="example.route">{{ example.label }}</a>
              }
            </div>

            @if (plannedTask(); as plannedTask) {
              <p class="rounded-lg bg-workspace-highlight/20 px-3 py-2 text-sm">
                Prototype plan prepared for: <strong>{{ plannedTask }}</strong>
              </p>
            }
          </section>

          <aside class="grid content-center gap-3 rounded-xl bg-muted p-4" aria-label="Task pilot workflow">
            @for (step of workflowSteps; track step.number) {
              <div class="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2.5">
                <span
                  class="grid size-7 place-items-center rounded-full bg-card text-xs font-semibold"
                  [class.bg-workspace-highlight]="step.number === 1"
                  [class.text-workspace-highlight-foreground]="step.number === 1"
                >
                  {{ step.number }}
                </span>
                <span>
                  <strong class="block text-sm font-medium">{{ step.title }}</strong>
                  <small class="block text-muted-foreground">{{ step.description }}</small>
                </span>
              </div>
            }
          </aside>
        </div>
      </z-card>

      <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <z-card zTitle="Your core" zDescription="Available now">
          <div class="grid divide-y">
            @for (item of coreFeatures; track item.route) {
              <a
                z-button
                zType="ghost"
                zFull
                [routerLink]="item.route"
                class="h-auto justify-start rounded-none py-3 text-left whitespace-normal first:pt-0 last:pb-0"
              >
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                  <ng-icon [name]="item.icon" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <strong class="block font-medium">{{ item.label }}</strong>
                  <small class="block text-muted-foreground">{{ item.description }}</small>
                </span>
                <ng-icon name="lucideChevronRight" aria-hidden="true" />
              </a>
            }
          </div>
        </z-card>

        <z-card zTitle="Collaboration first" zDescription="Building next">
          <div class="grid divide-y">
            @for (item of upcomingFeatures; track item.route) {
              <a
                z-button
                zType="ghost"
                zFull
                [routerLink]="item.route"
                class="h-auto justify-start rounded-none py-3 text-left whitespace-normal first:pt-0 last:pb-0"
              >
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                  <ng-icon [name]="item.icon" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <strong class="block font-medium">{{ item.label }}</strong>
                  <small class="block text-muted-foreground">{{ item.description }}</small>
                </span>
                <ng-icon name="lucideConstruction" class="text-amber-600 dark:text-amber-400" aria-label="Under construction" />
              </a>
            }
          </div>
        </z-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWorkspaceComponent {
  protected readonly taskModel = signal({
    request: 'Find a family-friendly home to rent in…',
  });
  protected readonly taskForm = form(this.taskModel, (path) => {
    required(path.request, { message: 'Describe the outcome you want.' });
  });
  protected readonly plannedTask = signal('');

  protected readonly taskExamples = [
    { label: 'Rent a home', route: '/private/task-pilot' },
    { label: 'Book a flight', route: '/private/task-pilot' },
    { label: 'Rent a car', route: '/private/task-pilot' },
    { label: 'Analyze a document', route: '/private/document-ai' },
  ] as const;

  protected readonly workflowSteps = [
    { number: 1, title: 'Clarify', description: 'Ask only for missing constraints' },
    { number: 2, title: 'Research & compare', description: 'Keep sources and trade-offs visible' },
    { number: 3, title: 'Ask for approval', description: 'Before spending, booking, or sending' },
    { number: 4, title: 'Complete & record', description: 'Save the result in your workspace' },
  ] as const;

  protected readonly coreFeatures = [
    { label: 'Profile', description: 'Your authenticated account', icon: 'lucideUserRound', route: '/private/profile' },
    { label: 'Books', description: 'Your existing private library', icon: 'lucideLibraryBig', route: '/private/books' },
  ] as const;

  protected readonly upcomingFeatures = [
    {
      label: 'Messages & channels',
      description: 'People and group conversations',
      icon: 'lucideMessageCircle',
      route: '/private/messages',
    },
    {
      label: 'Shared grocery lists',
      description: 'Local-first, offline-friendly collaboration',
      icon: 'lucideShoppingBasket',
      route: '/private/grocery',
    },
    {
      label: 'Files & document AI',
      description: 'Upload, extract, and reconcile',
      icon: 'lucideFolderUp',
      route: '/private/files',
    },
  ] as const;

  protected planTask(): void {
    void submit(this.taskForm, async () => {
      this.plannedTask.set(this.taskModel().request);
    });
  }
}
