import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBraces,
  lucideCheck,
  lucideCircleCheckBig,
  lucideCloudCheck,
  lucideCloudUpload,
  lucideConstruction,
  lucideDownload,
  lucideEllipsis,
  lucideFileJson,
  lucideFileText,
  lucideHash,
  lucideInfo,
  lucideListFilter,
  lucidePlus,
  lucideReceiptText,
  lucideScanLine,
  lucideSend,
  lucideUserPlus,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

type FeatureId = 'cv' | 'messages' | 'channels' | 'grocery' | 'files' | 'task-pilot' | 'document-ai' | 'reconcile';

interface FeatureConfig {
  readonly title: string;
  readonly description: string;
  readonly constructionNote: string;
}

const FEATURES: Record<FeatureId, FeatureConfig> = {
  cv: {
    title: 'Download CV',
    description: 'A stable, shareable copy of your professional profile.',
    constructionNote: 'The final download will expose one canonical CV with a visible freshness date.',
  },
  messages: {
    title: 'Messages',
    description: 'Private conversations between registered users.',
    constructionNote: 'Direct messages are planned for registered users only.',
  },
  channels: {
    title: 'Channels',
    description: 'Topic-based spaces for several registered users.',
    constructionNote: 'Channels add shared context without turning the workspace into a noisy social feed.',
  },
  grocery: {
    title: 'Grocery lists',
    description: 'Shared, local-first lists that stay useful with weak or no signal.',
    constructionNote: 'Loro + CRDT will merge concurrent edits, with sharing explicit per registered user.',
  },
  files: {
    title: 'Files',
    description: 'A private file layer that connects search, chat, and document workflows.',
    constructionNote: 'Uploads will be private by default. Sharing and AI analysis remain separate actions.',
  },
  'task-pilot': {
    title: 'Task pilot',
    description: 'An AI-assisted workspace for multi-step real-world outcomes.',
    constructionNote: 'The assistant may prepare work, but you approve every booking, payment, account change, or external message.',
  },
  'document-ai': {
    title: 'Document AI',
    description: 'Turn scans and PDFs into reviewable structured data.',
    constructionNote: 'OCR output stays a draft until a person confirms the extracted fields.',
  },
  reconcile: {
    title: 'Reconcile',
    description: 'Suggest matches between documents, generated booking data, and bank statement lines.',
    constructionNote: 'AI proposes matches; it does not silently post or alter accounting records.',
  },
};

@Component({
  selector: 'app-upcoming-feature',
  imports: [NgIcon, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
  viewProviders: [
    provideIcons({
      lucideBraces,
      lucideCheck,
      lucideCircleCheckBig,
      lucideCloudCheck,
      lucideCloudUpload,
      lucideConstruction,
      lucideDownload,
      lucideEllipsis,
      lucideFileJson,
      lucideFileText,
      lucideHash,
      lucideInfo,
      lucideListFilter,
      lucidePlus,
      lucideReceiptText,
      lucideScanLine,
      lucideSend,
      lucideUserPlus,
    }),
  ],
  template: `
    <div class="mx-auto grid max-w-6xl gap-5">
      <header>
        <p class="workspace-kicker">Private workspace</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight">{{ feature().title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ feature().description }}</p>
      </header>

      <div
        class="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-800 dark:text-amber-300"
      >
        <ng-icon name="lucideConstruction" class="mt-0.5 shrink-0" aria-hidden="true" />
        <p class="m-0"><strong class="font-semibold">Under construction.</strong> {{ feature().constructionNote }}</p>
      </div>

      @switch (featureId()) {
        @case ('cv') {
          <z-card>
            <div class="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 max-sm:grid-cols-[3.5rem_minmax(0,1fr)]">
              <span class="grid h-14 place-items-center rounded-lg border bg-muted text-muted-foreground">
                <ng-icon name="lucideFileText" class="text-2xl" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <strong class="block truncate font-medium">Andrei Margine — Senior Frontend Developer — CV.pdf</strong>
                <small class="text-muted-foreground">PDF · canonical version · recruiter-safe</small>
              </span>
              <button z-button type="button" zSize="lg" zDisabled class="max-sm:col-span-2 max-sm:w-full">
                <ng-icon name="lucideDownload" aria-hidden="true" /> Download
              </button>
            </div>
          </z-card>
        }

        @case ('messages') {
          <div class="grid grid-cols-[14rem_minmax(0,1fr)] gap-4 max-lg:grid-cols-1">
            <z-card zTitle="People" zDescription="Registered users">
              <div class="grid gap-1">
                @for (person of people; track person.initials) {
                  <button
                    z-button
                    zFull
                    zType="ghost"
                    type="button"
                    class="h-auto justify-start px-2 py-2.5 text-left"
                    [class.bg-muted]="$first"
                  >
                    <span class="grid size-8 place-items-center rounded-full bg-workspace-highlight text-xs font-semibold text-workspace-highlight-foreground">
                      {{ person.initials }}
                    </span>
                    <span><strong class="block font-medium">{{ person.name }}</strong><small class="text-muted-foreground">{{ person.status }}</small></span>
                  </button>
                }
              </div>
            </z-card>
            <z-card>
              <div class="grid gap-4">
                <div class="flex items-start justify-between gap-3 border-b pb-3">
                  <div><strong class="block font-medium">Maria C.</strong><small class="text-muted-foreground">Registered user · online</small></div>
                  <button z-button zType="outline" zSize="sm" type="button" zDisabled><ng-icon name="lucideInfo" /> Details</button>
                </div>
                <div class="grid gap-3">
                  <p class="m-0 max-w-[75%] rounded-xl rounded-bl-sm bg-muted px-3 py-2 text-sm">Can you share the grocery list for Saturday?</p>
                  <p class="m-0 ml-auto max-w-[75%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">Shared. It will also work offline in the store.</p>
                  <p class="m-0 max-w-[75%] rounded-xl rounded-bl-sm bg-muted px-3 py-2 text-sm">Perfect — I’ll add fruit.</p>
                </div>
                <div class="flex gap-2 rounded-xl border bg-background p-2 pl-3">
                  <input z-input zBorderless readonly placeholder="Message Maria…" aria-label="Message Maria" class="min-w-0 flex-1" />
                  <button z-button type="button" zDisabled><ng-icon name="lucideSend" /> Send</button>
                </div>
              </div>
            </z-card>
          </div>
        }

        @case ('channels') {
          <div class="grid grid-cols-[14rem_minmax(0,1fr)] gap-4 max-lg:grid-cols-1">
            <z-card zTitle="Channels" zDescription="Shared spaces">
              <div class="grid gap-1">
                @for (channel of channels; track channel) {
                  <button z-button zFull zType="ghost" type="button" class="justify-start" [class.bg-muted]="$first">
                    <ng-icon name="lucideHash" /> {{ channel }}
                  </button>
                }
              </div>
            </z-card>
            <z-card>
              <div class="grid gap-4">
                <div class="flex items-start justify-between gap-3 border-b pb-3">
                  <div><strong class="block font-medium"># family-plans</strong><small class="text-muted-foreground">4 members · shared files and lists</small></div>
                  <div class="flex -space-x-2" aria-label="Channel members">
                    @for (initials of ['AM', 'MC', 'VP']; track initials) {
                      <span class="grid size-8 place-items-center rounded-full border-2 border-card bg-workspace-highlight text-xs font-semibold text-workspace-highlight-foreground">{{ initials }}</span>
                    }
                  </div>
                </div>
                <div class="grid gap-3 text-sm">
                  <div><strong>Maria</strong><p class="mt-1 mb-0 max-w-[75%] rounded-xl rounded-bl-sm bg-muted px-3 py-2">I added our weekend options to the channel.</p></div>
                  <div><strong>Andrei</strong><p class="mt-1 mb-0 ml-auto max-w-[75%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">I’ll ask Task Pilot to compare travel time and cost.</p></div>
                </div>
                <div class="flex gap-2 rounded-xl border bg-background p-2 pl-3">
                  <input z-input zBorderless readonly placeholder="Message #family-plans…" aria-label="Message channel" class="min-w-0 flex-1" />
                  <button z-button type="button" zDisabled><ng-icon name="lucideSend" /> Send</button>
                </div>
              </div>
            </z-card>
          </div>
        }

        @case ('grocery') {
          <z-card>
            <div class="grid gap-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div><p class="workspace-kicker">Saturday market</p><h2 class="mt-1 text-xl font-semibold">Family groceries</h2></div>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400"><ng-icon name="lucideCloudCheck" /> Synced</span>
                  <div class="flex -space-x-2"><span class="workspace-avatar">AM</span><span class="workspace-avatar">MC</span></div>
                  <button z-button zType="outline" type="button" zDisabled><ng-icon name="lucideUserPlus" /> Share</button>
                </div>
              </div>
              <div class="grid divide-y">
                @for (item of groceryItems; track item.name) {
                  <label class="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3 py-3">
                    <input type="checkbox" class="size-4 accent-primary" [checked]="item.done" />
                    <span><strong class="block text-sm font-medium">{{ item.name }}</strong><small class="text-muted-foreground">{{ item.detail }}</small></span>
                    @if (item.editing) {
                      <span class="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-300">Maria editing</span>
                    }
                  </label>
                }
              </div>
              <div class="flex gap-2 rounded-xl border bg-background p-2 pl-3">
                <input z-input zBorderless readonly placeholder="Add an item…" aria-label="Add grocery item" class="min-w-0 flex-1" />
                <button z-button type="button" zDisabled><ng-icon name="lucidePlus" /> Add</button>
              </div>
            </div>
          </z-card>
        }

        @case ('files') {
          <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            <z-card>
              <div class="grid min-h-48 place-items-center gap-3 rounded-xl border border-dashed bg-muted/60 p-6 text-center">
                <ng-icon name="lucideCloudUpload" class="text-3xl text-muted-foreground" aria-hidden="true" />
                <div><h2 class="font-semibold">Drop files here</h2><p class="mt-1 text-sm text-muted-foreground">PDF, images, and text documents</p></div>
                <button z-button zType="outline" type="button" zDisabled>Choose files</button>
              </div>
            </z-card>
            <z-card zTitle="Your files" zDescription="Recent">
              <div class="grid divide-y">
                @for (file of files; track file.name) {
                  <div class="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span class="grid size-8 place-items-center rounded-lg bg-muted"><ng-icon [name]="file.icon" /></span>
                    <span class="min-w-0"><strong class="block truncate text-sm font-medium">{{ file.name }}</strong><small class="text-muted-foreground">{{ file.detail }}</small></span>
                    <button z-button zType="ghost" zSize="icon-sm" type="button" zDisabled [attr.aria-label]="'Actions for ' + file.name"><ng-icon name="lucideEllipsis" /></button>
                  </div>
                }
              </div>
            </z-card>
          </div>
        }

        @case ('task-pilot') {
          <z-card>
            <div class="grid gap-5">
              <div class="flex items-start justify-between gap-3"><div><p class="workspace-kicker">New workflow</p><h2 class="mt-1 text-xl font-semibold">Rent a family home</h2></div><span class="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"><ng-icon name="lucideConstruction" /> Interactive concept</span></div>
              <div class="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
                @for (step of pilotSteps; track step.number) {
                  <section class="grid min-h-40 content-start gap-2 rounded-xl border bg-muted/60 p-4" [class.border-workspace-highlight]="step.number === 1">
                    <span class="grid size-7 place-items-center rounded-full bg-card text-xs font-semibold" [class.bg-workspace-highlight]="step.number === 1">{{ step.number }}</span>
                    <h3 class="font-semibold">{{ step.title }}</h3>
                    <p class="text-sm text-muted-foreground">{{ step.description }}</p>
                    @if (step.number === 1) { <button z-button zType="outline" type="button" zDisabled class="mt-auto">Answer 4 questions</button> }
                  </section>
                }
              </div>
            </div>
          </z-card>
        }

        @case ('document-ai') {
          <z-card>
            <div class="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
              @for (step of documentSteps; track step.number) {
                <section class="grid min-h-44 content-start gap-3 rounded-xl border bg-muted/60 p-4" [class.border-workspace-highlight]="step.number === 1">
                  <ng-icon [name]="step.icon" class="text-xl" aria-hidden="true" />
                  <h2 class="font-semibold">{{ step.number }}. {{ step.title }}</h2>
                  <p class="text-sm text-muted-foreground">{{ step.description }}</p>
                  @if (step.number === 1) {
                    <div class="grid gap-2" aria-hidden="true"><span class="h-2 rounded-full bg-border"></span><span class="h-2 w-2/3 rounded-full bg-border"></span><span class="h-2 w-5/6 rounded-full bg-border"></span></div>
                  }
                </section>
              }
            </div>
          </z-card>
        }

        @case ('reconcile') {
          <z-card zTitle="Suggested matches" zDescription="Review queue">
            <div class="mb-4 flex justify-end"><button z-button zType="outline" type="button" zDisabled><ng-icon name="lucideListFilter" /> Filter</button></div>
            <div class="grid gap-2">
              @for (match of matches; track match.bank) {
                <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border bg-muted/50 p-3 max-sm:grid-cols-1">
                  <span class="min-w-0"><small class="block text-muted-foreground">{{ match.bankDate }}</small><strong class="block truncate text-sm font-medium">{{ match.bank }}</strong></span>
                  <span class="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">{{ match.confidence }}</span>
                  <span class="min-w-0"><small class="block text-muted-foreground">{{ match.documentDate }}</small><strong class="block truncate text-sm font-medium">{{ match.document }}</strong></span>
                </div>
              }
            </div>
          </z-card>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageUpcomingFeatureComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  protected readonly featureId = computed(() => (this.routeData()['feature'] as FeatureId | undefined) ?? 'messages');
  protected readonly feature = computed(() => FEATURES[this.featureId()]);

  protected readonly people = [
    { initials: 'MC', name: 'Maria', status: 'Draft ready' },
    { initials: 'VP', name: 'Victor', status: 'Yesterday' },
  ] as const;
  protected readonly channels = ['family-plans', 'travel', 'projects'] as const;
  protected readonly groceryItems = [
    { name: 'Oat milk', detail: '2 cartons · added by Andrei', done: false, editing: false },
    { name: 'Apples', detail: '1 kg · completed by Maria', done: true, editing: false },
    { name: 'Fresh bread', detail: 'Added moments ago', done: false, editing: true },
  ] as const;
  protected readonly files = [
    { icon: 'lucideFileText', name: 'Rental agreement.pdf', detail: 'Private · ready for analysis' },
    { icon: 'lucideReceiptText', name: 'August statement.pdf', detail: 'Private · OCR available' },
    { icon: 'lucideFileJson', name: 'books-export.json', detail: 'Private · indexed for search' },
  ] as const;
  protected readonly pilotSteps = [
    { number: 1, title: 'Constraints', description: 'City, dates, budget, rooms, commute, and accessibility.' },
    { number: 2, title: 'Shortlist', description: 'Comparable options with sources, costs, and trade-offs.' },
    { number: 3, title: 'Approve action', description: 'Review the exact recipient, price, and terms before proceeding.' },
  ] as const;
  protected readonly documentSteps = [
    { number: 1, title: 'OCR', icon: 'lucideScanLine', description: 'Read text, tables, totals, dates, and document identity.' },
    { number: 2, title: 'Extract', icon: 'lucideBraces', description: 'Map fields into a visible schema with source highlights and confidence.' },
    { number: 3, title: 'Review', icon: 'lucideCircleCheckBig', description: 'Confirm, correct, then create a draft record or export.' },
  ] as const;
  protected readonly matches = [
    { bankDate: 'Bank · 12 Aug', bank: '− €84.20 · MARKETPLACE', confidence: '98% match', documentDate: 'Receipt · 12 Aug', document: '€84.20 · Grocery receipt' },
    { bankDate: 'Bank · 14 Aug', bank: '− €310.00 · AIR TRAVEL', confidence: '91% match', documentDate: 'Booking · 14 Aug', document: '€310.00 · Flight reservation' },
    { bankDate: 'Bank · 15 Aug', bank: '− €47.50 · SERVICES', confidence: 'Uncertain', documentDate: 'No exact document', document: 'Needs review' },
  ] as const;
}
