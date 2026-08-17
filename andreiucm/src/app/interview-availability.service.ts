import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface InterviewSlot {
  start: string;
  end: string;
  label: string;
}

export interface InterviewAvailability {
  timeZone: string;
  durationMinutes: number;
  slots: InterviewSlot[];
}

export interface InterviewAvailabilityResponse {
  answer: string;
  availability: InterviewAvailability;
}

@Injectable({ providedIn: 'root' })
export class InterviewAvailabilityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://andreiucm-backend.andreiucm.deno.net';

  getAvailability(timeZone: string): Observable<InterviewAvailabilityResponse> {
    return this.http
      .post<unknown>(`${this.baseUrl}/interview-availability`, { timeZone })
      .pipe(map((response) => this.parseResponse(response)));
  }

  private parseResponse(response: unknown): InterviewAvailabilityResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('The scheduling assistant returned an invalid response.');
    }
    const candidate = response as Partial<InterviewAvailabilityResponse>;
    if (typeof candidate.answer !== 'string' || candidate.answer.trim().length === 0) {
      throw new Error('The scheduling assistant returned an invalid response.');
    }
    const availability = candidate.availability;
    if (
      !availability ||
      typeof availability.timeZone !== 'string' ||
      typeof availability.durationMinutes !== 'number' ||
      !Array.isArray(availability.slots) ||
      availability.slots.some(
        (slot) =>
          !slot ||
          typeof slot.start !== 'string' ||
          typeof slot.end !== 'string' ||
          typeof slot.label !== 'string',
      )
    ) {
      throw new Error('The scheduling assistant returned an invalid response.');
    }

    return {
      answer: candidate.answer.trim(),
      availability: {
        timeZone: availability.timeZone,
        durationMinutes: availability.durationMinutes,
        slots: availability.slots,
      },
    };
  }
}
