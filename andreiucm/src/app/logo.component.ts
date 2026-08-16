import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterModule],
  template: `<a routerLink="/" class="logo-link"><div class="logo">{{title()}}</div></a>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }
    .logo-link {
        text-decoration: none;
        color: inherit;
    }
  `]
})
export class LogoComponent {
  protected readonly title = signal("andreiucm");
}
