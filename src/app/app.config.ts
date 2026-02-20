import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AUTH_INITIALIZER_PROVIDER } from './core/auth/auth.initializer';
import { APP_CONFIG, AppConfig } from './core/config/app-config';

import { DB_DASHBOARD_PROVIDERS } from './features/db-dashboard/application/db-dashboard.facade';

const config: AppConfig = {
  apiBaseUrl: 'http://localhost:3000', // ✅ AJUSTA si tu API cambia
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // ✅ Interceptor correcto:
    // - Usa AuthService.token (memoria)
    // - En 401 intenta refresh y reintenta request
    provideHttpClient(withInterceptors([authInterceptor])),

    // ✅ intenta refresh al iniciar la app (NO debería bloquear UI)
    AUTH_INITIALIZER_PROVIDER,

    // ✅ Config centralizada
    { provide: APP_CONFIG, useValue: config },

    // ✅ Providers del dashboard
    ...DB_DASHBOARD_PROVIDERS,
  ],
};
