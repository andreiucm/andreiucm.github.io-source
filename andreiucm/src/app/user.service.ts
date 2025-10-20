import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

export interface User {
	id?: number;
	name?: string;
	email: string;
  password: string;
}

@Injectable({ providedIn: "root" })
export class UserService {
	// private baseUrl = "http://localhost:8000";
	private baseUrl = "https://andreiucm-backend.andreiucm.deno.net";

	constructor(private http: HttpClient) {}

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.baseUrl}/users`);
	}

	logIn(user: User): Observable<{token: string}> {
		return this.http.post<{token: string}>(`${this.baseUrl}/login`, user);
	}

  signUp(user: User): Observable<{success: boolean}> {
		return this.http.post<{success: boolean}>(`${this.baseUrl}/signup`, user);
	}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }
}
