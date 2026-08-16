import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PortfolioAssistant } from './portfolio-assistant.component';
import { UserService } from './user.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'landing-page',
  imports: [ReactiveFormsModule, PortfolioAssistant],
  template: `
    <main id="top">
      <nav class="nav" aria-label="Main navigation">
        <a class="monogram" href="#top" aria-label="Andrei Margine, home">AM<span>.</span></a>
        <div class="nav-links"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#assistant">Ask AI</a><a href="#contact">Contact</a></div>
        <button class="nav-cta" type="button" (click)="openAuth('login')">Login / Sign up</button>
      </nav>

      <section class="hero">
        <div class="eyebrow"><span></span> Available for remote & freelance work</div>
        <h1>I build frontend<br />systems that <em>last.</em></h1>
        <div class="hero-bottom"><p>Senior frontend developer with 15+ years turning complex product requirements into clear, resilient interfaces.</p><a class="round-link" href="#work" aria-label="Explore selected work">↓</a></div>
        <div class="hero-meta"><span>Chisinau, Moldova</span><span>Angular · React · TypeScript</span><span>EU work eligible</span></div>
      </section>

      <section class="statement" aria-label="Professional profile">
        <p class="section-label">01 / Profile</p>
        <p class="statement-text">I work where <strong>complexity meets clarity</strong> — state-driven interfaces, real-time communication, local-first collaboration, and product architecture built for years of change.</p>
        <div class="skill-rail" aria-label="Core skills">@for (skill of skills; track skill) { <span>{{ skill }}</span> }</div>
      </section>

      <section class="work" id="work">
        <div class="section-intro"><p class="section-label">02 / Selected work</p><h2>Products in the real world.</h2><p>A selection of long-term products I’ve helped shape, modernize, and maintain.</p></div>
        <div class="project-list">
          @for (project of projects; track project.href) {
            <a class="project" [href]="project.href" target="_blank" rel="noreferrer">
              <span class="project-number">{{ project.number }}</span><div><h3>{{ project.title }}</h3><p>{{ project.description }}</p><div class="tags">@for (tag of project.tags; track tag) { <span>{{ tag }}</span> }</div></div><span class="project-arrow" aria-hidden="true">↗</span>
            </a>
          }
        </div>
      </section>

      <section class="experience" id="experience">
        <p class="section-label">03 / Experience</p>
        <div class="experience-grid"><div class="experience-heading"><h2>Built over time.<br /><em>Still curious.</em></h2><p>From infrastructure and backend foundations to modern, collaborative frontend products.</p></div>
          <div class="timeline">@for (item of experience; track item.period) { <article><span>{{ item.period }}</span><div><h3>{{ item.role }}</h3><h4>{{ item.company }}</h4><p>{{ item.detail }}</p></div></article> }</div>
        </div>
      </section>

      <portfolio-assistant />

      <section class="access" id="access">
        <p class="section-label">05 / Private space</p>
        <div class="access-content"><div><h2>Continue to the<br />private workspace.</h2><p>Returning user or joining for the first time? Choose your path to continue.</p></div><div class="access-actions"><button class="primary-button" type="button" (click)="openAuth('login')">Log in <span>→</span></button><button class="secondary-button" type="button" (click)="openAuth('signup')">Create an account <span>→</span></button></div></div>
      </section>

      <footer id="contact">
        <div class="footer-lead"><p>Have a frontend problem worth solving?</p><h2>Let’s build something<br /><em>dependable.</em></h2></div>
        <div class="footer-links"><a href="https://github.com/andreiucm" target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href="https://www.linkedin.com/in/andrei-margine" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div>
        <div class="footer-bottom"><span>© 2026 Andrei Margine</span><span>Frontend software developer</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>

    <dialog #authDialog class="auth-dialog" (close)="authError.set('')">
      <button class="dialog-close" type="button" aria-label="Close authentication dialog" (click)="closeAuth()">×</button>
      <p class="dialog-kicker">Private workspace</p>
      <h2>{{ authMode() === 'login' ? 'Welcome back.' : 'Create your account.' }}</h2>
      <div class="auth-tabs" role="tablist" aria-label="Authentication options">
        <button type="button" role="tab" [attr.aria-selected]="authMode() === 'login'" (click)="selectAuthMode('login')">Log in</button>
        <button type="button" role="tab" [attr.aria-selected]="authMode() === 'signup'" (click)="selectAuthMode('signup')">Sign up</button>
      </div>

      @if (authMode() === 'login') {
        <form [formGroup]="loginForm" (ngSubmit)="login()">
          <label>Email<input type="email" formControlName="email" autocomplete="email" /></label>
          <label>Password<input type="password" formControlName="password" autocomplete="current-password" /></label>
          <button class="dialog-submit" type="submit" [disabled]="loginForm.invalid || submitting()">{{ submitting() ? 'Opening…' : 'Enter private space' }} <span>→</span></button>
        </form>
      } @else {
        <form [formGroup]="signupForm" (ngSubmit)="signup()">
          <label>Name<input type="text" formControlName="name" autocomplete="name" /></label>
          <label>Email<input type="email" formControlName="email" autocomplete="email" /></label>
          <label>Password<input type="password" formControlName="password" autocomplete="new-password" /></label>
          <button class="dialog-submit" type="submit" [disabled]="signupForm.invalid || submitting()">{{ submitting() ? 'Creating…' : 'Create account' }} <span>→</span></button>
        </form>
      }
      @if (authError()) { <p class="auth-error" role="alert">{{ authError() }}</p> }
    </dialog>
  `,
  styles: `
    :host { --ink:#11120f; --paper:#f2efe7; --lime:#d9ff43; --muted:#a7a99f; --line:rgba(242,239,231,.18); display:block; background:var(--ink); color:var(--paper); font-family:Arial,Helvetica,sans-serif; }
    * { box-sizing:border-box; } a { color:inherit; text-decoration:none; } button { font:inherit; }
    .nav { height:92px; display:flex; align-items:center; justify-content:space-between; padding:0 4.5vw; border-bottom:1px solid var(--line); }
    .monogram { font-size:1.4rem; font-weight:800; letter-spacing:-.08em; }.monogram span,h1 em,h2 em{color:var(--lime)}
    .nav-links{display:flex;gap:2.2rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.13em}
    .nav-cta{color:var(--paper);background:transparent;border:1px solid var(--paper);border-radius:999px;padding:.75rem 1.2rem;font-size:.72rem;text-transform:uppercase;letter-spacing:.11em;cursor:pointer}.nav-cta:hover{background:var(--lime);color:var(--ink)}
    .hero{min-height:calc(100vh - 92px);padding:8vh 4.5vw 3.5vh;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}.hero::after{content:"";position:absolute;width:32vw;height:32vw;border:1px solid rgba(217,255,67,.25);border-radius:50%;right:-14vw;top:7vh}.eyebrow,.section-label{color:var(--muted);font:500 .7rem/1.2 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.16em}.eyebrow{display:flex;align-items:center;gap:.7rem}.eyebrow span{width:7px;height:7px;border-radius:50%;background:var(--lime)}
    .hero h1{margin:5vh 0 3vh;max-width:1100px;font-size:clamp(4rem,9.8vw,9rem);line-height:.88;letter-spacing:-.07em;font-weight:600}h1 em,h2 em{font-family:Georgia,serif;font-weight:400}.hero-bottom{display:flex;align-items:end;justify-content:space-between;gap:2rem}.hero-bottom p{margin:0;max-width:590px;color:#c2c3ba;font-size:clamp(1.1rem,1.8vw,1.55rem);line-height:1.45}.round-link{width:62px;height:62px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;font-size:1.6rem}.hero-meta{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:1.1rem;margin-top:5vh;color:var(--muted);font:.65rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em}
    .statement{background:var(--paper);color:var(--ink);padding:9vw 4.5vw 7vw}.statement .section-label,.work .section-label{color:#6e7068}.statement-text{margin:3rem 0 6rem;max-width:1120px;font-size:clamp(2.3rem,5vw,5.2rem);line-height:1.02;letter-spacing:-.055em}.statement-text strong{font-family:Georgia,serif;font-weight:400;font-style:italic}.skill-rail{border-block:1px solid #b9b7af;padding:1.4rem 0;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font:.72rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em}
    .work{background:var(--paper);color:var(--ink);padding:4vw 4.5vw 10vw}.section-intro{display:grid;grid-template-columns:1fr 1.5fr;gap:2rem;margin-bottom:5rem}.section-intro h2,.experience-heading h2,.access h2,footer h2{margin:0;font-size:clamp(2.6rem,5vw,5rem);line-height:.95;letter-spacing:-.055em;font-weight:500}.section-intro>p:last-child{grid-column:2;max-width:520px;color:#60625c;font-size:1.05rem;line-height:1.55}.project{display:grid;grid-template-columns:70px 1fr 70px;gap:1rem;padding:2.4rem 0;border-top:1px solid #b9b7af}.project:last-child{border-bottom:1px solid #b9b7af}.project-number{font:.7rem ui-monospace,monospace;color:#777970;padding-top:.6rem}.project h3{margin:0 0 .8rem;font-size:clamp(1.7rem,3vw,2.8rem);letter-spacing:-.04em}.project p{max-width:680px;margin:0 0 1.2rem;color:#60625c;line-height:1.55}.tags{display:flex;gap:.5rem;flex-wrap:wrap}.tags span{border:1px solid #b9b7af;border-radius:999px;padding:.4rem .7rem;font-size:.65rem;text-transform:uppercase;letter-spacing:.08em}.project-arrow{font-size:1.8rem;justify-self:end}
    .experience{padding:9vw 4.5vw}.experience-grid{margin-top:4rem;display:grid;grid-template-columns:1fr 1.2fr;gap:8vw}.experience-heading{position:sticky;top:3rem;align-self:start}.experience-heading>p{max-width:450px;color:var(--muted);font-size:1.05rem;line-height:1.6;margin-top:2rem}.timeline article{display:grid;grid-template-columns:120px 1fr;gap:2rem;padding:0 0 3rem;margin-bottom:3rem;border-bottom:1px solid var(--line)}.timeline article>span{font:.67rem ui-monospace,monospace;color:var(--lime);text-transform:uppercase;letter-spacing:.1em}.timeline h3{margin:0;font-size:1.45rem}.timeline h4{margin:.45rem 0 1rem;color:var(--muted);font-weight:400}.timeline p{margin:0;color:#b6b8af;line-height:1.55}
    .access{background:var(--lime);color:var(--ink);padding:7vw 4.5vw}.access .section-label{color:#535e20}.access-content{display:grid;grid-template-columns:1.25fr 1fr;gap:8vw;align-items:end;margin-top:3.5rem}.access-content p{max-width:520px;margin:2rem 0 0;line-height:1.55;color:#4b521e}.access-actions{display:grid;gap:.8rem}.primary-button,.secondary-button{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 1.35rem;border:1px solid var(--ink);text-transform:uppercase;font-size:.72rem;letter-spacing:.11em;cursor:pointer}.primary-button{background:var(--ink);color:var(--paper)}.secondary-button{background:transparent;color:var(--ink)}
    footer{padding:9vw 4.5vw 2rem}.footer-lead p{color:var(--muted);margin:0 0 2rem}.footer-links{margin:6rem 0;border-top:1px solid var(--line)}.footer-links a{display:flex;justify-content:space-between;padding:1.5rem 0;border-bottom:1px solid var(--line);font-size:clamp(1.5rem,3vw,2.5rem)}.footer-bottom{display:flex;justify-content:space-between;color:var(--muted);font:.62rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em}
    .auth-dialog{width:min(92vw,500px);border:0;border-radius:0;padding:2.4rem;background:var(--paper);color:var(--ink);box-shadow:0 30px 100px rgba(0,0,0,.5)}.auth-dialog::backdrop{background:rgba(5,6,4,.82);backdrop-filter:blur(7px)}.dialog-close{position:absolute;right:1rem;top:.8rem;border:0;background:transparent;font-size:2rem;cursor:pointer}.dialog-kicker{font:.68rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.14em;color:#686a62}.auth-dialog h2{font-size:2.6rem;letter-spacing:-.05em;margin:.7rem 0 1.5rem}.auth-tabs{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #b9b7af;margin-bottom:1.5rem}.auth-tabs button{border:0;background:transparent;padding:.8rem;cursor:pointer;text-transform:uppercase;font-size:.7rem;letter-spacing:.1em}.auth-tabs button[aria-selected="true"]{background:var(--ink);color:var(--lime)}.auth-dialog form{display:grid;gap:1rem}.auth-dialog label{display:grid;gap:.45rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}.auth-dialog input{width:100%;border:1px solid #9a9b94;background:#fff;padding:.9rem;font-size:1rem;outline:none}.auth-dialog input:focus{border-color:var(--ink);box-shadow:0 0 0 2px var(--lime)}.dialog-submit{margin-top:.5rem;border:0;background:var(--ink);color:var(--paper);padding:1rem;display:flex;justify-content:space-between;text-transform:uppercase;font-size:.72rem;letter-spacing:.1em;cursor:pointer}.dialog-submit:disabled{opacity:.45;cursor:not-allowed}.auth-error{color:#a12626;font-size:.85rem;margin:1rem 0 0}
    @media(max-width:760px){.nav{height:76px;padding:0 1.25rem}.nav-links{display:none}.hero{min-height:calc(100vh - 76px);padding:4rem 1.25rem 1.5rem}.hero h1{font-size:clamp(3.7rem,17vw,5.7rem)}.hero-bottom{align-items:start}.round-link{flex:0 0 52px;width:52px;height:52px}.hero-meta span:nth-child(2){display:none}.statement,.work,.experience,.access,footer{padding-left:1.25rem;padding-right:1.25rem}.statement{padding-top:6rem}.statement-text{margin-bottom:4rem}.section-intro,.experience-grid,.access-content{grid-template-columns:1fr}.section-intro>p:last-child{grid-column:1}.section-intro{margin-bottom:3rem}.project{grid-template-columns:38px 1fr 30px}.experience-heading{position:static}.timeline article{grid-template-columns:90px 1fr;gap:1rem}.access{padding-block:5rem}.footer-bottom{gap:1rem;flex-wrap:wrap}.auth-dialog{padding:2rem 1.25rem}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authDialog = viewChild.required<ElementRef<HTMLDialogElement>>('authDialog');

  readonly authMode = signal<AuthMode>('login');
  readonly authError = signal('');
  readonly submitting = signal(false);
  readonly skills = ['Angular', 'React 19', 'TypeScript', 'XState', 'TanStack', 'CRDTs'];
  readonly projects = [
    { number: '01', title: 'Me-gusta Livechat', description: 'A long-running communications product evolved from AngularJS and CoffeeScript into a modern Angular experience.', tags: ['Angular', 'TypeScript', 'Real-time UI'], href: 'https://sexymaus.com/livechat' },
    { number: '02', title: 'Lidamus Call Cockpit', description: 'A browser-based VoIP calling workspace with complex call states modeled as a dependable user journey.', tags: ['Angular', 'XState', 'VoIP'], href: 'https://lidamus.cangora.com/' },
    { number: '03', title: 'Aioni Accounting', description: 'A modern accounting product with local-first collaboration, audit trails, data-heavy interfaces, and file workflows.', tags: ['React 19', 'TanStack', 'Local-first'], href: 'https://app.aioni.de/' },
  ];
  readonly experience = [
    { period: '2024 - Now', role: 'Frontend Software Developer', company: 'Lidamus & Comandita', detail: 'Angular and React product work spanning VoIP, collaborative data, accounting workflows, and AI-assisted engineering.' },
    { period: '2015 - 2024', role: 'Frontend Software Developer', company: 'Me-gusta AG', detail: 'Nine years modernizing and maintaining responsive communication products for distributed teams.' },
    { period: '2013 - 2015', role: 'Full-stack & Systems', company: 'Earlier experience', detail: 'Java, ASP.NET, databases, infrastructure, and the systems thinking that still informs my frontend work.' },
  ];

  readonly loginForm = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  readonly signupForm = this.fb.nonNullable.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  constructor() {
    afterNextRender(() => {
      if (this.route.snapshot.queryParamMap.get('auth') === 'login') this.openAuth('login');
    });
  }

  openAuth(mode: AuthMode) { this.selectAuthMode(mode); this.authDialog().nativeElement.showModal(); }
  closeAuth() { this.authDialog().nativeElement.close(); }
  selectAuthMode(mode: AuthMode) { this.authMode.set(mode); this.authError.set(''); }

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();
    this.submitting.set(true); this.authError.set('');
    this.userService.logIn(this.loginForm.getRawValue()).subscribe({
      next: ({ token }) => { this.authService.setToken(token); void this.router.navigate(['/private/profile']); },
      error: () => { this.authError.set('We could not log you in. Check your details and try again.'); this.submitting.set(false); },
    });
  }

  signup() {
    if (this.signupForm.invalid) return this.signupForm.markAllAsTouched();
    this.submitting.set(true); this.authError.set('');
    this.userService.signUp(this.signupForm.getRawValue()).subscribe({
      next: () => { this.submitting.set(false); this.selectAuthMode('login'); this.loginForm.controls.email.setValue(this.signupForm.controls.email.value); },
      error: () => { this.authError.set('We could not create the account. Please try again.'); this.submitting.set(false); },
    });
  }
}
