import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptorFn } from './auth.interceptor';

describe('authInterceptorFn', () => {
  let client: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('userToken');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptorFn])),
        provideHttpClientTesting(),
        AuthService,
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('userToken');
  });

  it('allows anonymous visitors to request interview availability', () => {
    client
      .post('https://andreiucm-backend.andreiucm.deno.net/interview-availability', {
        timeZone: 'Europe/Berlin',
      })
      .subscribe();

    const request = http.expectOne(
      'https://andreiucm-backend.andreiucm.deno.net/interview-availability',
    );
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
