import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../../core/config/api.config';
import { LogsQuery } from '../../domain/models/logs-query';
import { PagedLogs } from '../../domain/models/paged-logs';
import { LogsRepositoryPort } from '../../domain/ports/logs.repository';

/**
 * Implementación HTTP del puerto LogsRepositoryPort
 */
@Injectable()
export class LogsRepositoryHttp implements LogsRepositoryPort {
  private readonly url = `${API_CONFIG.baseUrl}/admin/logs`;

  constructor(private readonly http: HttpClient) {}

  getLogs(query: LogsQuery): Observable<PagedLogs> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('tail', query.tail);

    if (query.q) params = params.set('q', query.q);
    if (query.level) params = params.set('level', query.level);
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);

    return this.http.get<PagedLogs>(this.url, { params });
  }
}
