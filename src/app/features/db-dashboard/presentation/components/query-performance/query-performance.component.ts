import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { QueryPerformanceItem } from '../../../domain/models/query-performance';

@Component({
  selector: 'app-query-performance',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './query-performance.component.html',
  styleUrl: './query-performance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryPerformanceComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) items!: QueryPerformanceItem[];

  iconFor(status: QueryPerformanceItem['status']): string {
    switch (status) {
      case 'OK': return 'check_circle';
      case 'WARN': return 'report';
      case 'ERROR': return 'error';
      default: return 'info';
    }
  }

  cssFor(status: QueryPerformanceItem['status']): string {
    switch (status) {
      case 'OK': return 'ok';
      case 'WARN': return 'warn';
      case 'ERROR': return 'error';
      default: return 'ok';
    }
  }
}
