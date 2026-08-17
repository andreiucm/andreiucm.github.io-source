import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InterviewAvailabilityService } from './interview-availability.service';

describe('InterviewAvailabilityService', () => {
  let service: InterviewAvailabilityService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InterviewAvailabilityService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests an AI-formatted availability answer in the visitor timezone', () => {
    let answer = '';
    service.getAvailability('Europe/Berlin').subscribe((response) => {
      answer = response.answer;
    });

    const request = http.expectOne(
      'https://andreiucm-backend.andreiucm.deno.net/interview-availability',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ timeZone: 'Europe/Berlin' });
    request.flush({
      answer: 'Andrei has one interview time available.  ',
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
    });

    expect(answer).toBe('Andrei has one interview time available.');
  });

  it('rejects a response without structured availability', () => {
    let error: unknown;
    service.getAvailability('UTC').subscribe({
      error: (receivedError) => (error = receivedError),
    });

    http.expectOne('https://andreiucm-backend.andreiucm.deno.net/interview-availability').flush({
      answer: 'A slot is available.',
    });
    expect(error).toBeTruthy();
  });
});
