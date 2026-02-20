import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Inicializador NO bloqueante:
 * - Intentamos refresh silencioso al iniciar, pero NO detenemos el render.
 * - Si falla, AuthService ya limpia el estado (token/user = null).
 *
 * Beneficio:
 * - La app carga inmediatamente y el login siempre aparece si no hay sesión.
 */
export function authInitializerFactory(auth: AuthService) {
  return () => {
    // ✅ Fire-and-forget: no esperamos la respuesta para renderizar
    auth.refresh().subscribe({
      // No hacemos nada: el AuthService ya actualiza token/user
      next: () => {},
      error: () => {}, // refresh() ya hace catchError => normalmente no llega acá
    });
  };
}

export const AUTH_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: authInitializerFactory,
  deps: [AuthService],
  multi: true,
};
