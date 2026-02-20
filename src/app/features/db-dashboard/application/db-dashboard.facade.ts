import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardMetrics } from '../domain/models/db-metrics';
import { GetDashboardMetricsUseCase } from './use-cases/get-dashboard-metrics.usecase';
import { InMemoryDbMetricsRepository } from '../infrastructure/repositories/in-memory-db-metrics.repository';
import { DbMetricsRepository } from '../domain/ports/db-metrics.repository';

/**
 * Facade de estado para la UI.
 * - expone signals consumibles en components
 * - encapsula loading/error
 * SOLID:
 *  - DIP: depende de un repo abstracto (inyectable).
 */
@Injectable({ providedIn: 'root' })
export class DbDashboardFacade {
  // Estado UI (signals)
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _data = signal<DashboardMetrics | null>(null);

  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly data = computed(() => this._data());

  constructor(
    // Por defecto usa InMemory; si luego creas HttpDbMetricsRepository, lo cambias con provider.
    private readonly uc: GetDashboardMetricsUseCase,
  ) {}

  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.uc.execute()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => this._data.set(res),
        error: () => this._error.set('No fue posible cargar las métricas del dashboard.'),
      });
  }
}

/**
 * Provider recomendado (Feature-level) para cumplir DIP sin ensuciar AppModule.
 * Si ya tienes un contenedor DI global, puedes mover esto ahí.
 */
export const DB_DASHBOARD_PROVIDERS = [
  { provide: DbMetricsRepository, useClass: InMemoryDbMetricsRepository },
];
