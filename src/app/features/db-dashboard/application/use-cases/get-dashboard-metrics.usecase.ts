import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardMetrics } from '../../domain/models/db-metrics';
import { DbMetricsRepository } from '../../domain/ports/db-metrics.repository';

/**
 * Caso de uso: obtiene las métricas del dashboard.
 * SRP: solo coordina la obtención (no formatea UI).
 */
@Injectable({ providedIn: 'root' })
export class GetDashboardMetricsUseCase {
  constructor(private readonly repo: DbMetricsRepository) {}

  execute(): Observable<DashboardMetrics> {
    return this.repo.getDashboardMetrics();
  }
}
