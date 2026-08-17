import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, pattern, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

export interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number;
}

const BOOKS_URL = 'https://andreiucm-backend.andreiucm.deno.net/books';

@Component({
  selector: 'app-books',
  imports: [FormField, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
  template: `
    <div class="mx-auto grid max-w-6xl gap-5">
      <header>
        <p class="workspace-kicker">Private workspace</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight">Books</h1>
        <p class="mt-2 text-muted-foreground">Your existing private library, ready to become part of workspace search.</p>
      </header>

      <div class="grid grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] items-start gap-4 max-lg:grid-cols-1">
        <z-card zTitle="Books list" zDescription="Saved through the existing authenticated API">
          @if (booksResource.isLoading()) {
            <p class="m-0 text-sm text-muted-foreground" role="status">Loading books…</p>
          } @else if (booksResource.error()) {
            <div class="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              Failed to load books. Please try again later.
            </div>
          } @else {
            <div class="grid divide-y">
              @for (book of booksResource.value(); track book.id) {
                <article class="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3 first:pt-0 last:pb-0">
                  <div class="min-w-0">
                    <h2 class="truncate text-sm font-semibold">{{ book.title }}</h2>
                    <p class="mt-1 mb-0 text-sm text-muted-foreground">{{ book.author }}</p>
                  </div>
                  <time class="text-sm text-muted-foreground">{{ book.published_year }}</time>
                </article>
              } @empty {
                <p class="m-0 text-sm text-muted-foreground">No books saved yet.</p>
              }
            </div>
          }
        </z-card>

        <z-card zTitle="Add a new book" zDescription="Built with Angular Signal Forms">
          <form class="grid gap-4" (submit)="addBook(); $event.preventDefault()">
            <div class="grid gap-1.5">
              <label for="book-title" class="text-sm font-medium">Title</label>
              <input
                z-input
                id="book-title"
                type="text"
                placeholder="Enter book title"
                [formField]="bookForm.title"
              />
              @if (bookForm.title().touched() && bookForm.title().invalid()) {
                <p class="m-0 text-xs text-destructive">{{ bookForm.title().errors()[0].message }}</p>
              }
            </div>

            <div class="grid gap-1.5">
              <label for="book-author" class="text-sm font-medium">Author</label>
              <input
                z-input
                id="book-author"
                type="text"
                placeholder="Enter author name"
                [formField]="bookForm.author"
              />
              @if (bookForm.author().touched() && bookForm.author().invalid()) {
                <p class="m-0 text-xs text-destructive">{{ bookForm.author().errors()[0].message }}</p>
              }
            </div>

            <div class="grid gap-1.5">
              <label for="book-year" class="text-sm font-medium">Publication year</label>
              <input
                z-input
                id="book-year"
                type="text"
                inputmode="numeric"
                placeholder="For example, 2024"
                [formField]="bookForm.year"
              />
              @if (bookForm.year().touched() && bookForm.year().invalid()) {
                <p class="m-0 text-xs text-destructive">{{ bookForm.year().errors()[0].message }}</p>
              }
            </div>

            @if (submissionError()) {
              <p class="m-0 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {{ submissionError() }}
              </p>
            }

            <button
              z-button
              zFull
              zSize="lg"
              type="submit"
              [zLoading]="isSubmitting()"
              [zDisabled]="bookForm().invalid() || isSubmitting()"
            >
              Add book
            </button>
          </form>
        </z-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent {
  private readonly http = inject(HttpClient);

  protected readonly booksResource = httpResource<Book[]>(() => BOOKS_URL);
  protected readonly bookModel = signal({ title: '', author: '', year: '' });
  protected readonly bookForm = form(this.bookModel, (path) => {
    required(path.title, { message: 'Title is required.' });
    required(path.author, { message: 'Author is required.' });
    required(path.year, { message: 'Publication year is required.' });
    pattern(path.year, /^(1[0-9]{3}|20[0-9]{2}|2100)$/, {
      message: 'Enter a four-digit year between 1000 and 2100.',
    });
  });
  protected readonly isSubmitting = signal(false);
  protected readonly submissionError = signal('');

  protected addBook(): void {
    void submit(this.bookForm, async () => {
      this.isSubmitting.set(true);
      this.submissionError.set('');

      try {
        const book = this.bookModel();
        await firstValueFrom(
          this.http.post(BOOKS_URL, {
            title: book.title,
            author: book.author,
            published_year: Number(book.year),
          }),
        );
        this.booksResource.reload();
        this.bookForm().reset({ title: '', author: '', year: '' });
      } catch {
        this.submissionError.set('The book could not be saved. Your form values were kept.');
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }
}
