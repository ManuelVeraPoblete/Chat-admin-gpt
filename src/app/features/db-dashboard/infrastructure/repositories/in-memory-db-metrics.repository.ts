import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { DbMetricsRepository } from '../../domain/ports/db-metrics.repository';
import { DashboardMetrics } from '../../domain/models/db-metrics';

/**
 * Repositorio In-Memory (mock).
 * Simula latencia para que la UI parezca real sin depender de backend.
 */
@Injectable({ providedIn: 'root' })
export class InMemoryDbMetricsRepository extends DbMetricsRepository {
  override getDashboardMetrics(): Observable<DashboardMetrics> {
    const data: DashboardMetrics = {
      pageTitle: 'Database Management Dashboard',
      leftPanel: {
        kind: 'MONGODB',
        title: 'MongoDB Database',
        status: 'CONNECTED',
        collectionsOrTablesLabel: 'Collections',
        collectionsOrTablesCount: 12,
        documentsOrRecordsLabel: 'Documents',
        documentsOrRecordsCount: 325_678,
        storageSizeLabel: 'Storage Size',
        storageSizeValue: '1.5 GB',

        barChartTitle: 'Collection Stats',
        barItems: [
          { label: 'Users', value: 65 },
          { label: 'Orders', value: 110 },
          { label: 'Logs', value: 85 },
          { label: 'Products', value: 130 },
        ],

        donutTitle: 'Indexed',
        donutPercent: 72,
        donutSecondaryLabel: 'Unindexed',
        donutSecondaryPercent: 28,

        lineTitle: 'Time',
        linePoints: [
          { xLabel: '1', y: 20 },
          { xLabel: '2', y: 38 },
          { xLabel: '3', y: 28 },
          { xLabel: '4', y: 55 },
          { xLabel: '5', y: 42 },
          { xLabel: '6', y: 60 },
          { xLabel: '7', y: 49 },
          { xLabel: '8', y: 52 },
        ],

        recentOperationsTitle: 'Recent Operations',
        recentOperations: [
          { id: 'op-1', label: 'Update Order', type: 'UPDATE', relativeTime: '5 minutes ago' },
          { id: 'op-2', label: 'Insert User', type: 'INSERT', relativeTime: '20 minutes ago' },
          { id: 'op-3', label: 'Delete Log Entry', type: 'DELETE', relativeTime: '45 minutes ago' },
        ],

        queryPerformanceTitle: 'Query Performance',
        queryPerformance: [
          { id: 'q-1', statement: 'SELECT * FROM orders', status: 'OK', relativeTime: '10 minutes ago' },
          { id: 'q-2', statement: 'UPDATE users SET ...', status: 'OK', relativeTime: '30 minutes ago' },
          { id: 'q-3', statement: 'DELETE FROM products', status: 'WARN', relativeTime: '1 hour ago' },
        ],
      },
      rightPanel: {
        kind: 'MYSQL',
        title: 'MySQL Database',
        status: 'CONNECTED',
        collectionsOrTablesLabel: 'Tables',
        collectionsOrTablesCount: 8,
        documentsOrRecordsLabel: 'Records',
        documentsOrRecordsCount: 457_890,
        storageSizeLabel: 'Storage Size',
        storageSizeValue: '2.3 GB',

        barChartTitle: 'Table Stats',
        barItems: [
          { label: 'Customers', value: 160 },
          { label: 'Orders', value: 120 },
          { label: 'Invoices', value: 140 },
          { label: 'Sales', value: 180 },
        ],

        donutTitle: 'Indexed',
        donutPercent: 68,
        donutSecondaryLabel: 'Unindexed',
        donutSecondaryPercent: 32,

        lineTitle: 'Time',
        linePoints: [
          { xLabel: '1', y: 40 },
          { xLabel: '2', y: 58 },
          { xLabel: '3', y: 35 },
          { xLabel: '4', y: 70 },
          { xLabel: '5', y: 48 },
          { xLabel: '6', y: 62 },
          { xLabel: '7', y: 41 },
          { xLabel: '8', y: 50 },
        ],

        recentOperationsTitle: 'Recent Operations',
        recentOperations: [
          { id: 'op-4', label: 'Insert Invoice', type: 'INSERT', relativeTime: '7 minutes ago' },
          { id: 'op-5', label: 'Update Customer', type: 'UPDATE', relativeTime: '25 minutes ago' },
          { id: 'op-6', label: 'Delete Temp Row', type: 'DELETE', relativeTime: '1 hour ago' },
        ],

        queryPerformanceTitle: 'Query Performance',
        queryPerformance: [
          { id: 'q-4', statement: 'SELECT * FROM customers', status: 'OK', relativeTime: '12 minutes ago' },
          { id: 'q-5', statement: 'UPDATE orders SET ...', status: 'OK', relativeTime: '40 minutes ago' },
          { id: 'q-6', statement: 'DELETE FROM invoices', status: 'ERROR', relativeTime: '2 hours ago' },
        ],
      },
    };

    return of(data).pipe(delay(250));
  }
}
