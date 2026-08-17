import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageWorkspaceComponent } from './page.workspace.component';

describe('PageWorkspaceComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWorkspaceComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the approved private workspace structure', async () => {
    const fixture = TestBed.createComponent(PageWorkspaceComponent);

    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Good morning, Andrei.');
    expect(text).toContain('Start with an outcome, not an app.');
    expect(text).toContain('Your core');
    expect(text).toContain('Collaboration first');
  });

  it('captures a local task plan without sending it externally', async () => {
    const fixture = TestBed.createComponent(PageWorkspaceComponent);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('#task-request') as HTMLInputElement;
    input.value = 'Compare flights to Barcelona';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Prototype plan prepared for:');
    expect(fixture.nativeElement.textContent).toContain('Compare flights to Barcelona');
  });
});
