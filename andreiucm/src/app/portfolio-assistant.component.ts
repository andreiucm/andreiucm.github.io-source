import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PortfolioAssistantService } from './portfolio-assistant.service';

type PortfolioMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
};

const MAX_QUESTIONS = 10;

@Component({
  selector: 'portfolio-assistant',
  template: `
    <section class="ask-section" id="assistant">
      <p class="section-label">04 / Portfolio assistant</p>
      <div class="ask-content">
        <div>
          <h2>Questions before<br />the first call?</h2>
          <p>
            Explore my professional background through an AI assistant grounded in information I
            have approved for this portfolio.
          </p>
        </div>
        <button class="ask-button" type="button" (click)="open()">
          Ask about my experience <span aria-hidden="true">→</span>
        </button>
      </div>
      <p class="assistant-note">
        <span>Grounded AI</span> Answers use approved professional information. AI can make mistakes,
        and no account is required.
      </p>
    </section>

    @if (isOpen()) {
      <aside
        class="chat-panel"
        role="dialog"
        aria-label="Ask AI about Andrei"
        aria-modal="false"
        (keydown.escape)="close()"
      >
        <header class="chat-header">
          <div class="assistant-identity">
            <span class="assistant-status" aria-hidden="true"></span>
            <div>
              <strong>Ask about Andrei</strong>
              <span>Portfolio assistant · grounded AI</span>
            </div>
          </div>
          <button type="button" (click)="close()" aria-label="Close portfolio assistant">×</button>
        </header>

        <div class="chat-notice">
          Answers use approved professional information only. AI can make mistakes.
        </div>

        <div class="chat-messages" aria-live="polite" aria-relevant="additions">
          @for (message of messages(); track message.id) {
            <div class="message" [class.user]="message.role === 'user'">
              {{ message.text }}
            </div>
          }
          @if (isAnswering()) {
            <div class="message typing" aria-label="Assistant is answering">
              <span></span><span></span><span></span>
            </div>
          }
          <div #messagesEnd></div>
        </div>

        @if (questionsAsked() === 0) {
          <div class="suggestions" aria-label="Suggested questions">
            @for (suggestion of suggestedQuestions; track suggestion) {
              <button type="button" (click)="askQuestion(suggestion)">{{ suggestion }}</button>
            }
          </div>
        }

        <form class="chat-composer" (submit)="submitQuestion($event)">
          <label for="recruiter-question">Ask a question</label>
          <div>
            <input
              #questionInput
              id="recruiter-question"
              [value]="question()"
              (input)="updateQuestion($event)"
              [placeholder]="
                questionsRemaining() > 0
                  ? 'Ask about skills, work, or experience…'
                  : 'Session question limit reached'
              "
              maxlength="240"
              [disabled]="questionsRemaining() <= 0"
              autocomplete="off"
            />
            <button
              type="submit"
              [disabled]="!question().trim() || isAnswering() || questionsRemaining() <= 0"
              aria-label="Send question"
            >
              ↑
            </button>
          </div>
          <span>{{ questionsRemaining() }} of {{ maxQuestions }} questions remaining</span>
        </form>
      </aside>
    } @else {
      <button class="chat-launcher" type="button" (click)="open()">
        <span aria-hidden="true">✦</span><span>Ask AI about Andrei</span>
      </button>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .ask-section { background: var(--paper); color: var(--ink); padding: 8vw 4.5vw 6vw; }
    .section-label { margin: 0; color: #6e7068; font: 500 .7rem/1.2 ui-monospace, monospace; text-transform: uppercase; letter-spacing: .16em; }
    .ask-content { display: grid; grid-template-columns: 1.25fr 1fr; gap: 8vw; align-items: end; margin-top: 3.5rem; }
    .ask-content h2 { margin: 0; font-size: clamp(2.6rem, 5vw, 5rem); line-height: .95; letter-spacing: -.055em; font-weight: 500; }
    .ask-content p { max-width: 590px; margin: 2rem 0 0; color: #5d5f58; font-size: 1.05rem; line-height: 1.6; }
    .ask-button { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 1.25rem 1.4rem; border: 1px solid var(--ink); background: var(--ink); color: var(--paper); text-transform: uppercase; font-size: .72rem; letter-spacing: .11em; cursor: pointer; }
    .assistant-note { margin: 4rem 0 0; padding-top: 1rem; border-top: 1px solid #b9b7af; color: #686a62; font: .68rem/1.6 ui-monospace, monospace; }
    .chat-launcher { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 40; display: flex; align-items: center; gap: .75rem; border: 0; border-radius: 999px; padding: .95rem 1.2rem; background: var(--lime); color: var(--ink); box-shadow: 0 14px 45px rgba(0,0,0,.35); font-weight: 700; cursor: pointer; }
    .chat-panel { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 50; width: min(430px, calc(100vw - 3rem)); height: min(680px, calc(100vh - 3rem)); display: grid; grid-template-rows: auto auto minmax(0,1fr) auto auto; overflow: hidden; background: var(--paper); color: var(--ink); box-shadow: 0 24px 80px rgba(0,0,0,.45); }
    .chat-header { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.2rem; background: var(--ink); color: var(--paper); }
    .assistant-identity { display: flex; align-items: center; gap: .75rem; }
    .assistant-status { width: 9px; height: 9px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 4px rgba(217,255,67,.12); }
    .assistant-identity div { display: grid; gap: .2rem; }
    .assistant-identity div > span { color: #aeb0a7; font: .62rem ui-monospace, monospace; }
    .chat-header button { border: 0; padding: .2rem .35rem; background: transparent; color: var(--paper); font-size: 1.7rem; line-height: 1; cursor: pointer; }
    .chat-notice { padding: .65rem 1.2rem; border-bottom: 1px solid #d0cec6; color: #696b64; font-size: .62rem; }
    .chat-messages { overflow-y: auto; padding: 1.1rem; display: flex; flex-direction: column; gap: .8rem; }
    .message { align-self: flex-start; max-width: 88%; padding: .8rem .9rem; background: white; border: 1px solid #d7d5cd; font-size: .88rem; line-height: 1.5; }
    .message.user { align-self: flex-end; background: var(--ink); color: var(--paper); border-color: var(--ink); }
    .typing { display: flex; gap: .28rem; width: max-content; }
    .typing span { width: 5px; height: 5px; border-radius: 50%; background: #777970; animation: pulse 1s infinite ease-in-out; }
    .typing span:nth-child(2) { animation-delay: .14s; }
    .typing span:nth-child(3) { animation-delay: .28s; }
    .suggestions { display: flex; gap: .45rem; overflow-x: auto; padding: 0 1.1rem 1rem; }
    .suggestions button { flex: 0 0 auto; border: 1px solid #aaa9a2; border-radius: 999px; padding: .55rem .75rem; background: transparent; color: var(--ink); font-size: .7rem; cursor: pointer; }
    .chat-composer { padding: 1rem 1.1rem; border-top: 1px solid #c9c7c0; }
    .chat-composer label { display: block; margin-bottom: .45rem; color: #696b64; font-size: .62rem; }
    .chat-composer > div { display: grid; grid-template-columns: 1fr 44px; border: 1px solid #999b94; background: white; }
    .chat-composer input { min-width: 0; border: 0; outline: 0; padding: .78rem; background: transparent; color: var(--ink); }
    .chat-composer button { border: 0; background: var(--ink); color: var(--lime); font-size: 1.15rem; cursor: pointer; }
    .chat-composer button:disabled, .chat-composer input:disabled { opacity: .45; cursor: not-allowed; }
    .chat-composer > span { display: block; margin-top: .45rem; color: #74766f; font-size: .58rem; text-align: right; }
    @keyframes pulse { 0%, 60%, 100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
    @media (max-width: 760px) {
      .ask-section { padding: 6rem 1.25rem 5rem; }
      .ask-content { grid-template-columns: 1fr; gap: 2.5rem; }
      .assistant-note { margin-top: 3rem; }
      .chat-launcher { right: 1rem; bottom: 1rem; }
      .chat-panel { inset: 0; width: 100vw; height: 100dvh; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAssistant {
  private readonly assistant = inject(PortfolioAssistantService);
  private readonly questionInput = viewChild<ElementRef<HTMLInputElement>>('questionInput');
  private readonly messagesEnd = viewChild<ElementRef<HTMLElement>>('messagesEnd');
  private nextMessageId = 2;

  readonly maxQuestions = MAX_QUESTIONS;
  readonly isOpen = signal(false);
  readonly isAnswering = signal(false);
  readonly question = signal('');
  readonly messages = signal<PortfolioMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hi — I’m Andrei’s portfolio assistant. Ask me about his experience, skills, projects, or the kind of role he is looking for.',
    },
  ]);
  readonly questionsAsked = computed(
    () => this.messages().filter((message) => message.role === 'user').length,
  );
  readonly questionsRemaining = computed(() =>
    Math.max(0, MAX_QUESTIONS - this.questionsAsked()),
  );
  readonly suggestedQuestions = [
    'What kind of role is Andrei looking for?',
    'What is his strongest frontend experience?',
    'Tell me about his Angular background.',
    'What experience does he have with React?',
    'What products has he worked on?',
  ];

  constructor() {
    effect(() => {
      this.messages();
      this.isAnswering();
      queueMicrotask(() =>
        this.messagesEnd()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' }),
      );
    });
  }

  open(): void {
    this.isOpen.set(true);
    queueMicrotask(() => this.questionInput()?.nativeElement.focus());
  }

  close(): void {
    this.isOpen.set(false);
  }

  updateQuestion(event: Event): void {
    this.question.set((event.target as HTMLInputElement).value);
  }

  submitQuestion(event: SubmitEvent): void {
    event.preventDefault();
    void this.askQuestion(this.question());
  }

  async askQuestion(text: string): Promise<void> {
    const cleanQuestion = text.trim();
    if (!cleanQuestion || this.isAnswering() || this.questionsRemaining() <= 0) return;

    this.messages.update((messages) => [
      ...messages,
      { id: this.nextMessageId++, role: 'user', text: cleanQuestion },
    ]);
    this.question.set('');
    this.isAnswering.set(true);

    try {
      const response = await firstValueFrom(this.assistant.askQuestion(cleanQuestion));
      this.appendAssistantMessage(response.answer);
    } catch {
      this.appendAssistantMessage(
        'I could not reach the portfolio assistant just now. Please try again in a moment.',
      );
    } finally {
      this.isAnswering.set(false);
      queueMicrotask(() => this.questionInput()?.nativeElement.focus());
    }
  }

  private appendAssistantMessage(text: string): void {
    this.messages.update((messages) => [
      ...messages,
      { id: this.nextMessageId++, role: 'assistant', text },
    ]);
  }
}
