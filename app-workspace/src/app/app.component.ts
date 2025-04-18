import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    template: `
    <h1>Welcome to {{title()}}!</h1>

    <router-outlet></router-outlet>
  `,
    styles: []
})
export class AppComponent {
  title = signal('andreiucm.github.io');
}
