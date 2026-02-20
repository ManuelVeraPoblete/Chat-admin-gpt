import { Provider } from '@angular/core';
import { APP_CONFIG, AppConfig } from './app-config';
import { environment } from '../../../environments/environment';

/**
 * Construye AppConfig desde environment.
 * - Centraliza mapping a configuración inyectable
 * - IMPORTANTE: usa el mismo InjectionToken que consume AuthService
 */
function buildConfig(): AppConfig {
  return {
    apiBaseUrl: environment.apiBaseUrl,
    debug: !environment.production,
  };
}

export const APP_CONFIG_PROVIDER: Provider = {
  provide: APP_CONFIG,
  useFactory: buildConfig,
};
