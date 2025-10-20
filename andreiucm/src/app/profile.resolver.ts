import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from "./auth.service";

export const profileResolver: ResolveFn<any> = () => {
    const userService = inject(UserService);
    const authService = inject(AuthService);
    const router = inject(Router);

    return userService.getProfile().pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
            // Token invalid → delete token and cancel navigation
            authService.removeToken();
            // Stay in home (or redirect to home explicitly)
            router.navigateByUrl('/home');

            // Return null so the route does not activate
            return of(null);
            } else {
            // Other errors → log and optionally return fallback data
            console.error('Profile load error:', err);
            return of(null);
            }
        })
    );
};
