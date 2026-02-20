import { DbKind } from './db-kind';
import { RecentOperation } from './operations';
import { QueryPerformanceItem } from './query-performance';

export interface BarItem {
  label: string;
  value: number;
}

export interface LinePoint {
  xLabel: string;
  y: number;
}

export interface DbPanelMetrics {
  kind: DbKind;
  title: string; // "MongoDB Database" / "MySQL Database"
  status: 'CONNECTED' | 'DISCONNECTED';
  collectionsOrTablesLabel: string; // "Collections" o "Tables"
  collectionsOrTablesCount: number;

  documentsOrRecordsLabel: string; // "Documents" o "Records"
  documentsOrRecordsCount: number;

  storageSizeLabel: string; // "Storage Size"
  storageSizeValue: string; // "1.5 GB"

  // Charts
  barChartTitle: string; // "Collection Stats" / "Table Stats"
  barItems: BarItem[];

  donutTitle: string; // "Indexed"
  donutPercent: number; // 0..100
  donutSecondaryLabel: string; // "Unindexed"
  donutSecondaryPercent: number; // 0..100

  lineTitle: string; // "Time"
  linePoints: LinePoint[];

  // Lists
  recentOperationsTitle: string; // "Recent Operations"
  recentOperations: RecentOperation[];

  queryPerformanceTitle: string; // "Query Performance"
  queryPerformance: QueryPerformanceItem[];
}

export interface DashboardMetrics {
  pageTitle: string; // "Database Management Dashboard"
  leftPanel: DbPanelMetrics; // Mongo
  rightPanel: DbPanelMetrics; // MySQL
}
