import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopPanelComponent } from './layout.top-panel.component';
import { PrimarySideBarComponent } from './layout.primary-side-bar.component';

@Component({
	selector: "app-root",
	imports: [RouterOutlet, TopPanelComponent, PrimarySideBarComponent],
	template: `
    <div class="layout">
      <primary-side-bar></primary-side-bar>
      <div class="main-container">
        <top-panel></top-panel>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
	styles: `
    :host {
      display: block;
      height: 100vh;
    }

    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .main-container {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 0;
    }

    .main-content {
      padding: 2rem;
      overflow-y: auto;
      min-height: 0;
    }
  `,
})
export class App {}
