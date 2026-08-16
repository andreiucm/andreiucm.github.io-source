import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PortfolioAssistantService } from './portfolio-assistant.service';

describe('PortfolioAssistantService', () => {
  let service: PortfolioAssistantService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PortfolioAssistantService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts the question to the public assistant endpoint', () => {
    let answer = '';

    service.askQuestion('What Angular experience does Andrei have?').subscribe((response) => {
      answer = response.answer;
    });

    const request = http.expectOne(
      'https://andreiucm-backend.andreiucm.deno.net/assistant/questions',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      question: 'What Angular experience does Andrei have?',
    });

    request.flush({ answer: 'He has extensive Angular experience.  ' });
    expect(answer).toBe('He has extensive Angular experience.');
  });

  it('rejects a response without an answer', () => {
    let error: unknown;

    service.askQuestion('Tell me about Andrei.').subscribe({
      error: (receivedError) => (error = receivedError),
    });

    http.expectOne('https://andreiucm-backend.andreiucm.deno.net/assistant/questions').flush({});
    expect(error).toBeTruthy();
  });
});
