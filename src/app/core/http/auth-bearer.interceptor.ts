import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

/**
 * Interceptor JWT:
 * - Agrega Authorization: Bearer <token> si existe
 * - Clean: la UI no se ensucia con headers
 */
export const authBearerInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStorageService);
  const token = tokenStore.getToken();

  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
