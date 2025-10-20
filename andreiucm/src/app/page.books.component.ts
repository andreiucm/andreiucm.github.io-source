import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Book {
	id: number;
	title: string;
	author: string;
	published_year: number;
}

@Component({
  selector: 'app-books',
  imports: [CommonModule, ReactiveFormsModule],
  styles: `
    .form-container {
      max-width: 350px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    h3 {
      text-align: center;
      margin-bottom: 2rem;
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
    input {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:disabled {
      background: #b0b0b0;
      cursor: not-allowed;
    }
  `,
  template: `
    <h2>Books List</h2>

    @if(booksResource.isLoading()) {
      <p>Loading books...</p>
    } @else if(booksResource.error()){
      <p>Failed to load books.</p>
    } @else {
      <ul>
        @for (book of booksResource.value(); track $index) {
          <li>
            <strong>{{ book.title }}</strong> by {{ book.author }} ({{ book.published_year }})
          </li>
        }
      </ul>
    }

    <div class="form-container">
      <h3>Add a new book</h3>
      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" placeholder="Enter book title" formControlName="title" />
          @if (bookForm.get('title')?.invalid && bookForm.get('title')?.touched) {
            <div class="error">Title is required</div>
          }
        </div>
        <div class="form-group">
          <label for="author">Author</label>
          <input id="author" type="text" placeholder="Enter author name" formControlName="author" />
          @if (bookForm.get('author')?.invalid && bookForm.get('author')?.touched) {
            <div class="error">Author is required</div>
          }
        </div>
        <div class="form-group">
          <label for="year">Year</label>
          <input id="year" type="number" placeholder="Publication year" formControlName="year" />
          @if (bookForm.get('year')?.invalid && bookForm.get('year')?.touched) {
            <div class="error">Year is required</div>
          }
        </div>
        <button type="submit" [disabled]="bookForm.invalid">Add Book</button>
      </form>
    </div>
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
