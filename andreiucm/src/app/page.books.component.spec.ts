import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BooksComponent } from './page.books.component';

const BOOKS_URL = 'https://andreiucm-backend.andreiucm.deno.net/books';

describe('BooksComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('keeps the existing books endpoint and renders its response', async () => {
    const fixture = TestBed.createComponent(BooksComponent);

    (await waitForRequest(http, 'GET')).flush([
      { id: 1, title: 'Clean Architecture', author: 'Robert C. Martin', published_year: 2017 },
    ]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Clean Architecture');
    expect(fixture.nativeElement.textContent).toContain('Robert C. Martin');
  });

  it('submits the Signal Form with the unchanged API payload', async () => {
    const fixture = TestBed.createComponent(BooksComponent);
    (await waitForRequest(http, 'GET')).flush([]);
    await fixture.whenStable();

    setInputValue(fixture.nativeElement, '#book-title', 'Domain-Driven Design');
    setInputValue(fixture.nativeElement, '#book-author', 'Eric Evans');
    setInputValue(fixture.nativeElement, '#book-year', '2003');
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const post = await waitForRequest(http, 'POST');
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual({
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      published_year: 2003,
    });
    post.flush({ id: 2 });

    (await waitForRequest(http, 'GET')).flush([]);
    await fixture.whenStable();

    expect((fixture.nativeElement.querySelector('#book-title') as HTMLInputElement).value).toBe('');
  });
});

function setInputValue(root: HTMLElement, selector: string, value: string): void {
  const input = root.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function nextTask(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function waitForRequest(http: HttpTestingController, method: 'GET' | 'POST'): Promise<TestRequest> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const [request] = http.match((candidate) => candidate.url === BOOKS_URL && candidate.method === method);
    if (request) {
      return request;
    }
    await nextTask();
  }

  throw new Error(`Timed out waiting for ${method} ${BOOKS_URL}`);
}
