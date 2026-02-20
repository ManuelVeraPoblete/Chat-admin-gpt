import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LogsQuery } from '../models/logs-query';
import { PagedLogs } from '../models/paged-logs';

/**
 * Puerto (DIP):
 * - Usamos InjectionToken porque Angular no inyecta interfaces/types.
 */
export interface LogsRepositoryPort {
  getLogs(query: LogsQuery): Observable<PagedLogs>;
}

export const LOGS_REPOSITORY = new InjectionToken<LogsRepositoryPort>('LOGS_REPOSITORY');
