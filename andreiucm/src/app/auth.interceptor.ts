import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from "./auth.service";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Ignore adding Authorization (and don't block) for auth/public routes
    const url = req.url || '';
    const ignoreRegex = /\/(login|signin|home)(\/|$)/i;
    if (ignoreRegex.test(url)) {
        // Continue without modifying the request
        return next(req);
    }

    // 🚫 No token → block the request
    if (!authService.token) {
        console.warn('Blocking request — no auth token');
        router.navigate(['/login']);
        return throwError(() => new Error('No auth token'));
    }

    // ✅ Clone request and attach Authorization header
    const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authService.token}` },
    });

    // Continue with modified request
    return next(authReq);
};
