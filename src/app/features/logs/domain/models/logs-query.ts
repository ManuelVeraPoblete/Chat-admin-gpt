import { LogLevel } from './log-level';

export interface LogsQuery {
  page: number;
  size: number;
  tail: number;

  q?: string;
  level?: Exclude<LogLevel, 'UNKNOWN'>;
  from?: string; // ISO
  to?: string;   // ISO
}
