export type OperationType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RecentOperation {
  id: string;
  label: string;
  type: OperationType;
  relativeTime: string; // ej: "5 minutes ago"
}
