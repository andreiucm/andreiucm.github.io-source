import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimarySideBarComponent } from './layout.primary-side-bar.component';
import { TopPanelComponent } from './layout.top-panel.component';

@Component({
  selector: 'private-layout',
  imports: [RouterOutlet, TopPanelComponent, PrimarySideBarComponent],
  template: `
    <div class="grid min-h-dvh grid-cols-[15.5rem_minmax(0,1fr)] bg-background text-foreground max-md:grid-cols-1">
      <primary-side-bar />
      <div class="min-w-0">
        <top-panel />
        <main class="private-workspace-canvas min-h-[calc(100dvh-4.25rem)] px-6 py-7 max-sm:px-4 max-sm:py-5">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `:host { display: block; min-height: 100dvh; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayout {}
