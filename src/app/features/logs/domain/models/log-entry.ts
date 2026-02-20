import { LogLevel } from './log-level';

export interface LogEntry {
  index: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  raw: string;
}
