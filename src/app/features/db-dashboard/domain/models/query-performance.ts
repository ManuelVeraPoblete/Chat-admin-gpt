export type QueryStatus = 'OK' | 'WARN' | 'ERROR';

export interface QueryPerformanceItem {
  id: string;
  statement: string;
  status: QueryStatus;
  relativeTime: string; // ej: "10 minutes ago"
}
