import { Observable } from 'rxjs';
import { LogsQuery } from '../models/logs-query';
import { PagedLogs } from '../models/paged-logs';

export abstract class LogsRepository {
  abstract getLogs(query: LogsQuery): Observable<PagedLogs>;
}
