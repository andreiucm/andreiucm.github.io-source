import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InterviewAvailabilityService } from './interview-availability.service';
import { InterviewScheduler } from './interview-scheduler.component';

describe('InterviewScheduler', () => {
  it('opens the modal and displays the agent availability answer', async () => {
    const availabilityService = jasmine.createSpyObj<InterviewAvailabilityService>(
      'InterviewAvailabilityService',
      ['getAvailability'],
    );
    availabilityService.getAvailability.and.returnValue(
      of({
        answer:
          'Andrei is available Wednesday, August 19, 2:00 PM–2:45 PM GMT+2. No meeting has been booked yet.',
        availability: {
          timeZone: 'Europe/Berlin',
          durationMinutes: 45,
          slots: [
            {
              start: '2026-08-19T12:00:00.000Z',
              end: '2026-08-19T12:45:00.000Z',
              label: 'Wednesday, August 19, 2:00 PM–2:45 PM GMT+2',
            },
          ],
        },
      }),
    );
    await TestBed.configureTestingModule({
      imports: [InterviewScheduler],
      providers: [{ provide: InterviewAvailabilityService, useValue: availabilityService }],
    }).compileComponents();
    const fixture = TestBed.createComponent(InterviewScheduler);
    fixture.detectChanges();

    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.schedule-trigger');
    trigger.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    expect(dialog.open).toBeTrue();
    expect(availabilityService.getAvailability).toHaveBeenCalledWith(jasmine.any(String));
    expect(dialog.textContent).toContain('Andrei is available Wednesday, August 19');
    expect(dialog.textContent).toContain('45 minute interview');
    expect(dialog.textContent).toContain('Europe/Berlin');
  });
});
