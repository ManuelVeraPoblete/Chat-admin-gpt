import { LogEntry } from './log-entry';

export interface PagedLogs {
  page: number;
  size: number;
  total: number;
  lastEventAt?: string;
  items: LogEntry[];
}
