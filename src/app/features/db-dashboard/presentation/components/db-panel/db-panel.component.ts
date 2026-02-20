import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DbPanelMetrics } from '../../../domain/models/db-metrics';
import { StatTileComponent } from '../stat-tile/stat-tile.component';
import { BarChartComponent } from '../charts/bar-chart.component';
import { DonutChartComponent } from '../charts/donut-chart.component';
import { LineChartComponent } from '../charts/line-chart.component';
import { RecentOperationsComponent } from '../recent-operations/recent-operations.component';
import { QueryPerformanceComponent } from '../query-performance/query-performance.component';

@Component({
  selector: 'app-db-panel',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    StatTileComponent,
    BarChartComponent,
    DonutChartComponent,
    LineChartComponent,
    RecentOperationsComponent,
    QueryPerformanceComponent,
  ],
  templateUrl: './db-panel.component.html',
  styleUrl: './db-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbPanelComponent {
  @Input({ required: true }) metrics!: DbPanelMetrics;

  get icon(): string {
    return this.metrics.kind === 'MONGODB' ? 'local_fire_department' : 'storage';
  }

  get statusDotClass(): string {
    return this.metrics.status === 'CONNECTED' ? 'ok' : 'down';
  }

  get statusLabel(): string {
    return this.metrics.status === 'CONNECTED' ? 'Connected' : 'Disconnected';
  }
}
