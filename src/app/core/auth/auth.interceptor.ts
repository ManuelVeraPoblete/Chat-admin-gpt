import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * Interceptor JWT:
 * - Adjunta Authorization: Bearer <token> si existe
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Mantén cookies (refresh) si tu backend las usa
  let request: HttpRequest<any> = req.clone({ withCredentials: true });

  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request);
};
