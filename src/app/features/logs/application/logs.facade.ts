import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { LogsQuery } from '../domain/models/logs-query';
import { PagedLogs } from '../domain/models/paged-logs';
import { GetLogsUseCase } from './use-cases/get-logs.usecase';

/**
 * Facade: estado para UI (Clean)
 */
@Injectable()
export class LogsFacade {
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _data = signal<PagedLogs | null>(null);

  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly data = computed(() => this._data());

  constructor(private readonly uc: GetLogsUseCase) {}

  load(query: LogsQuery): void {
    this._loading.set(true);
    this._error.set(null);

    this.uc.execute(query)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => this._data.set(res),
        error: () => this._error.set('No fue posible cargar los logs. Revisa token/back-end.'),
      });
  }
}
