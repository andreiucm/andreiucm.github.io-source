import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ZardCardComponent } from '@/shared/components/card';
import { User } from './user.service';

@Component({
  selector: 'app-profile',
  imports: [ZardCardComponent],
  template: `
    <div class="mx-auto grid max-w-4xl gap-5">
      <header>
        <p class="workspace-kicker">Private workspace</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight">Profile</h1>
        <p class="mt-2 text-muted-foreground">Your authenticated account inside the new workspace shell.</p>
      </header>

      @if (profile(); as profile) {
        <z-card zTitle="Account details" zDescription="Loaded from the existing protected profile endpoint">
          <div class="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-4 max-sm:grid-cols-1">
            <span
              class="grid size-16 place-items-center rounded-2xl bg-workspace-highlight text-lg font-semibold text-workspace-highlight-foreground"
              aria-hidden="true"
            >
              {{ initials(profile) }}
            </span>
            <dl class="grid gap-3 sm:grid-cols-2">
              <div>
                <dt class="text-xs font-medium tracking-wide text-muted-foreground uppercase">Name</dt>
                <dd class="mt-1 font-medium">{{ profile.name || 'Not provided' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium tracking-wide text-muted-foreground uppercase">Email</dt>
                <dd class="mt-1 break-all font-medium">{{ profile.email }}</dd>
              </div>
            </dl>
          </div>
        </z-card>
      } @else {
        <p class="text-sm text-muted-foreground" role="status">Loading profile…</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly profile = signal<User | null>((this.route.snapshot.data['profile'] as User | undefined) ?? null);

  protected initials(profile: User): string {
    const name = profile.name?.trim();
    if (!name) {
      return profile.email.slice(0, 2).toUpperCase();
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
