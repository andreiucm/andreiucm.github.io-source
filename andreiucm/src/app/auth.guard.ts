import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    if (!authService.hasToken()) {
      const router = inject(Router);
      router.navigate(['/'], { queryParams: { auth: 'login' } });
      return false;
    }
    return true;
};
