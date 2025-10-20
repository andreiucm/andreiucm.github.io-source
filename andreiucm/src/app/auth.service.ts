import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    token = localStorage.getItem("userToken");

    setToken(token: string): void {
        localStorage.setItem("userToken", token);
        this.token = token;
    }

    removeToken(): void {
        localStorage.removeItem("userToken");
        this.token = null;
    }

    hasToken(): boolean {
        return !!this.token;
    }
}
