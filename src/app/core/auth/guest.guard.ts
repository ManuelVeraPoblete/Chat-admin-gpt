import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard para páginas públicas (login).
 * - Si ya hay sesión, no tiene sentido mostrar login => /dashboard
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/dashboard');
  return false;
};
