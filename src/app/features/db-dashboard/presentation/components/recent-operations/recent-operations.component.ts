import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { RecentOperation } from '../../../domain/models/operations';

@Component({
  selector: 'app-recent-operations',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './recent-operations.component.html',
  styleUrl: './recent-operations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentOperationsComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) items!: RecentOperation[];

  iconFor(type: RecentOperation['type']): string {
    switch (type) {
      case 'INSERT': return 'check_circle';
      case 'UPDATE': return 'sync';
      case 'DELETE': return 'cancel';
      default: return 'info';
    }
  }

  cssFor(type: RecentOperation['type']): string {
    switch (type) {
      case 'INSERT': return 'ok';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'danger';
      default: return 'info';
    }
  }
}
