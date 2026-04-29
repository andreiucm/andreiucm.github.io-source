import { Component } from '@angular/core';

import { HttpClient, httpResource } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardInputDirective } from '@/shared/components/input';

export interface Book {
	id: number;
	title: string;
	author: string;
	published_year: number;
}

@Component({
  selector: 'app-books',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardComponent, ZardInputDirective],
  styles: `
    :host {
      display: grid;
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .form-container {
      max-width: 350px;
      width: 100%;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .book-list {
      margin: 0;
      padding-left: 1.25rem;
    }
  `,
  template: `
    <z-card zTitle="Books List" zDescription="Browse the saved books">
      @if(booksResource.isLoading()) {
        <p>Loading books...</p>
      } @else if(booksResource.error()){
        <p>Failed to load books.</p>
      } @else {
        <ul class="book-list">
          @for (book of booksResource.value(); track book.id) {
            <li>
              <strong>{{ book.title }}</strong> by {{ book.author }} ({{ book.published_year }})
            </li>
          }
        </ul>
      }
    </z-card>

    <z-card class="form-container" zTitle="Add a new book">
      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input z-input id="title" type="text" placeholder="Enter book title" formControlName="title" />
          @if (bookForm.get('title')?.invalid && bookForm.get('title')?.touched) {
            <div class="error">Title is required</div>
          }
        </div>
        <div class="form-group">
          <label for="author">Author</label>
          <input z-input id="author" type="text" placeholder="Enter author name" formControlName="author" />
          @if (bookForm.get('author')?.invalid && bookForm.get('author')?.touched) {
            <div class="error">Author is required</div>
          }
        </div>
        <div class="form-group">
          <label for="year">Year</label>
          <input z-input id="year" type="number" placeholder="Publication year" formControlName="year" />
          @if (bookForm.get('year')?.invalid && bookForm.get('year')?.touched) {
            <div class="error">Year is required</div>
          }
        </div>
        <button z-button zFull type="submit" [zDisabled]="bookForm.invalid">Add Book</button>
      </form>
    </z-card>
  `,
})
export class BooksComponent {
  // booksResource = httpResource<Book[]>(() => 'http://localhost:8000/books');
  booksResource = httpResource<Book[]>(() => 'https://andreiucm-backend.andreiucm.deno.net/books');

  bookForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) return;

    const bookData = this.bookForm.value;

    // this.http.post("http://localhost:8000/books", {
    this.http.post("https://andreiucm-backend.andreiucm.deno.net/books", {
      title: bookData.title,
      author: bookData.author,
      published_year: bookData.year,
    }).subscribe({
      next: () => {
        this.booksResource.reload();
        this.bookForm.reset();
      },
      error: (err) => {
        console.error('Failed to add book:', err);
      }
    });
  }
}
