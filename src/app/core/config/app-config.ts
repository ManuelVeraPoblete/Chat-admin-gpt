import { InjectionToken } from '@angular/core';

/**
 * Configuración central de la app.
 * - Se inyecta en servicios (Auth, API, etc.)
 * - Evita hardcodear URLs en múltiples lugares
 */
export interface AppConfig {
  /** Base URL del backend (ej: http://localhost:3000) */
  apiBaseUrl: string;

  /** Habilita logs adicionales en dev */
  debug?: boolean;
}

/**
 * InjectionToken de configuración.
 * - Debe ser provisto en main/app.config
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
