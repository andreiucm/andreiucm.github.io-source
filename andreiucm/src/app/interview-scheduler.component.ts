import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  InterviewAvailabilityResponse,
  InterviewAvailabilityService,
} from './interview-availability.service';

@Component({
  selector: 'interview-scheduler',
  template: `
    <button class="schedule-trigger" type="button" (click)="open()">
      Schedule interview
    </button>

    <dialog
      #scheduleDialog
      class="schedule-dialog"
      aria-labelledby="schedule-title"
      (click)="closeFromBackdrop($event)"
    >
      <div class="dialog-shell">
        <header>
          <div>
            <p class="dialog-kicker"><span aria-hidden="true"></span> Calendar agent</p>
            <h2 id="schedule-title">Find a time to talk.</h2>
          </div>
          <button class="dialog-close" type="button" aria-label="Close availability" (click)="close()">
            ×
          </button>
        </header>

        <div class="dialog-content" aria-live="polite">
          @if (isLoading()) {
            <div class="loading" role="status">
              <span class="spinner" aria-hidden="true"></span>
              <div>
                <strong>Checking Andrei’s calendar…</strong>
                <p>The AI agent is asking the availability tool for safe interview times.</p>
              </div>
            </div>
          } @else if (error()) {
            <div class="error" role="alert">
              <strong>Availability could not be loaded.</strong>
              <p>{{ error() }}</p>
              <button type="button" (click)="retry()">Try again <span aria-hidden="true">↻</span></button>
            </div>
          } @else if (response(); as result) {
            <div class="agent-answer">
              <p class="answer-label">AI availability summary</p>
              <p class="answer">{{ result.answer }}</p>
              <div class="availability-meta">
                <span>{{ result.availability.durationMinutes }} minute interview</span>
                <span>{{ result.availability.timeZone }}</span>
              </div>
            </div>
          }
        </div>

        <footer>
          <p>Live calendar snapshot · private event details are never shown</p>
          <button type="button" (click)="close()">Close</button>
        </footer>
      </div>
    </dialog>
  `,
  styles: `
    :host { display: block; }
    button { font: inherit; }
    .schedule-trigger { color: var(--paper); background: transparent; border: 1px solid var(--paper); border-radius: 999px; padding: .75rem 1.2rem; font-size: .72rem; text-transform: uppercase; letter-spacing: .11em; cursor: pointer; transition: background .2s, color .2s; }
    .schedule-trigger:hover, .schedule-trigger:focus-visible { background: var(--lime); color: var(--ink); outline: none; }
    .schedule-dialog { position: fixed; inset: 0; width: min(92vw, 650px); max-height: min(86vh, 720px); margin: auto; border: 0; padding: 0; background: var(--paper); color: var(--ink); box-shadow: 0 30px 100px rgba(0,0,0,.58); }
    .schedule-dialog::backdrop { background: rgba(5,6,4,.84); backdrop-filter: blur(8px); }
    .dialog-shell { min-height: 420px; display: grid; grid-template-rows: auto 1fr auto; }
    header { display: flex; justify-content: space-between; gap: 2rem; padding: 2.2rem 2.4rem 1.8rem; background: var(--ink); color: var(--paper); }
    .dialog-kicker { display: flex; align-items: center; gap: .6rem; margin: 0 0 .85rem; color: #aeb0a7; font: .66rem ui-monospace, monospace; text-transform: uppercase; letter-spacing: .14em; }
    .dialog-kicker span { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 4px rgba(217,255,67,.12); }
    h2 { margin: 0; font-size: clamp(2.3rem, 6vw, 4rem); line-height: .95; letter-spacing: -.055em; font-weight: 500; }
    .dialog-close { align-self: start; border: 0; padding: 0 .25rem; background: transparent; color: var(--paper); font-size: 2rem; line-height: 1; cursor: pointer; }
    .dialog-content { display: grid; align-items: center; padding: 2.4rem; }
    .loading { display: flex; align-items: flex-start; gap: 1.1rem; }
    .loading strong, .error strong { display: block; margin-bottom: .5rem; font-size: 1.05rem; }
    .loading p, .error p { margin: 0; color: #686a62; line-height: 1.55; }
    .spinner { flex: 0 0 auto; width: 24px; height: 24px; border: 2px solid #c8c6be; border-top-color: var(--ink); border-radius: 50%; animation: spin .8s linear infinite; }
    .answer-label { margin: 0 0 1.1rem; color: #686a62; font: .65rem ui-monospace, monospace; text-transform: uppercase; letter-spacing: .13em; }
    .answer { margin: 0; white-space: pre-line; font-size: clamp(1.15rem, 2.6vw, 1.45rem); line-height: 1.55; letter-spacing: -.015em; }
    .availability-meta { display: flex; gap: .55rem; flex-wrap: wrap; margin-top: 1.8rem; }
    .availability-meta span { border: 1px solid #aaa9a2; border-radius: 999px; padding: .45rem .7rem; font: .62rem ui-monospace, monospace; text-transform: uppercase; letter-spacing: .08em; }
    .error button { display: flex; justify-content: space-between; gap: 2rem; min-width: 170px; margin-top: 1.5rem; border: 1px solid var(--ink); padding: .8rem 1rem; background: var(--ink); color: var(--paper); text-transform: uppercase; font-size: .68rem; letter-spacing: .1em; cursor: pointer; }
    footer { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.1rem 2.4rem; border-top: 1px solid #c9c7c0; }
    footer p { margin: 0; color: #74766f; font: .6rem/1.5 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .07em; }
    footer button { border: 0; background: transparent; color: var(--ink); font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 760px) {
      .schedule-trigger { padding: .68rem .85rem; font-size: .62rem; }
      .schedule-dialog { width: 100vw; max-width: none; height: 100dvh; max-height: none; margin: 0; }
      .dialog-shell { min-height: 100%; }
      header { padding: 2rem 1.25rem 1.7rem; }
      .dialog-content { padding: 2rem 1.25rem; }
      footer { align-items: flex-end; padding: 1rem 1.25rem; }
    }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 1.8s; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewScheduler {
  private readonly availabilityService = inject(InterviewAvailabilityService);
  private readonly scheduleDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('scheduleDialog');

  readonly isLoading = signal(false);
  readonly response = signal<InterviewAvailabilityResponse | null>(null);
  readonly error = signal('');

  open(): void {
    this.scheduleDialog().nativeElement.showModal();
    if (!this.response() && !this.isLoading()) void this.loadAvailability();
  }

  close(): void {
    this.scheduleDialog().nativeElement.close();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === this.scheduleDialog().nativeElement) this.close();
  }

  retry(): void {
    void this.loadAvailability();
  }

  private async loadAvailability(): Promise<void> {
    this.isLoading.set(true);
    this.error.set('');
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const response = await firstValueFrom(this.availabilityService.getAvailability(timeZone));
      this.response.set(response);
    } catch {
      this.error.set('Please try again in a moment. No meeting has been created.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
