import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimarySideBarComponent } from './layout.primary-side-bar.component';
import { TopPanelComponent } from './layout.top-panel.component';

@Component({
  selector: 'private-layout',
  imports: [RouterOutlet, TopPanelComponent, PrimarySideBarComponent],
  template: `
    <div class="layout">
      <primary-side-bar />
      <div class="main-container">
        <top-panel />
        <main class="main-content"><router-outlet /></main>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 100vh; }
    .layout { display: grid; grid-template-columns: 280px 1fr; height: 100vh; background: var(--background); color: var(--foreground); }
    .main-container { display: grid; grid-template-rows: auto 1fr; min-height: 0; }
    .main-content { padding: 2rem; overflow-y: auto; min-height: 0; }
    @media (max-width: 760px) { .layout { grid-template-columns: 1fr; } primary-side-bar { display: none; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayout {}
