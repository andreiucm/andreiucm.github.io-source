import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface PortfolioAssistantResponse {
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioAssistantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://andreiucm-backend.andreiucm.deno.net';

  askQuestion(question: string): Observable<PortfolioAssistantResponse> {
    return this.http
      .post<unknown>(`${this.baseUrl}/assistant/questions`, { question })
      .pipe(map((response) => this.parseResponse(response)));
  }

  private parseResponse(response: unknown): PortfolioAssistantResponse {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('answer' in response) ||
      typeof response.answer !== 'string' ||
      response.answer.trim().length === 0
    ) {
      throw new Error('The assistant returned an invalid response.');
    }

    return { answer: response.answer.trim() };
  }
}
