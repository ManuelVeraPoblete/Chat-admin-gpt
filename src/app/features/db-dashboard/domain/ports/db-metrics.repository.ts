import { Observable } from 'rxjs';
import { DashboardMetrics } from '../models/db-metrics';

/**
 * Puerto (interface) para obtener métricas.
 * Permite cambiar InMemory -> HTTP sin tocar Application/Presentation (DIP).
 */
export abstract class DbMetricsRepository {
  abstract getDashboardMetrics(): Observable<DashboardMetrics>;
}
