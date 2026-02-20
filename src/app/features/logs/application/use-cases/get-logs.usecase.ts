import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LogsQuery } from '../../domain/models/logs-query';
import { PagedLogs } from '../../domain/models/paged-logs';
import { LOGS_REPOSITORY, LogsRepositoryPort } from '../../domain/ports/logs.repository';

/**
 * UseCase: obtener logs
 * - Depende del puerto (DIP)
 */
@Injectable()
export class GetLogsUseCase {
  constructor(
    @Inject(LOGS_REPOSITORY) private readonly repo: LogsRepositoryPort,
  ) {}

  execute(query: LogsQuery): Observable<PagedLogs> {
    return this.repo.getLogs(query);
  }
}
