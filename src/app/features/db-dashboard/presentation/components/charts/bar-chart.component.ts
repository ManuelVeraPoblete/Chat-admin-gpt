import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarItem } from '../../../domain/models/db-metrics';

/**
 * Bar chart minimalista (SVG).
 * Evita librerías externas (no deprecated) y mantiene control total del diseño.
 */
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap">
      <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="svg" role="img" aria-label="Bar chart">
        <!-- axis baseline -->
        <line x1="28" [attr.y1]="height-26" [attr.x2]="width-8" [attr.y2]="height-26" class="axis"></line>

        <ng-container *ngFor="let b of bars(); let i = index">
          <rect
            [attr.x]="b.x"
            [attr.y]="b.y"
            [attr.width]="b.w"
            [attr.height]="b.h"
            class="bar"
            rx="6"
          ></rect>

          <text [attr.x]="b.x + (b.w/2)" [attr.y]="height-10" text-anchor="middle" class="label">
            {{ b.label }}
          </text>
        </ng-container>
      </svg>
    </div>
  `,
  styles: [`
    .wrap { width: 100%; }
    .svg { width: 100%; height: 170px; display: block; }
    .axis { stroke: rgba(255,255,255,0.18); stroke-width: 1; }
    .bar {
      fill: rgba(120, 255, 190, 0.55);
      stroke: rgba(120, 255, 190, 0.25);
      stroke-width: 1;
    }
    .label { fill: rgba(232,238,252,0.8); font-size: 10px; font-weight: 700; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  @Input({ required: true }) set items(value: BarItem[]) {
    this._items.set(value ?? []);
  }

  protected readonly width = 520;
  protected readonly height = 190;

  private readonly _items = signal<BarItem[]>([]);

  readonly bars = computed(() => {
    const items = this._items();
    const max = Math.max(...items.map(i => i.value), 1);

    const chartLeft = 28;
    const chartRight = this.width - 8;
    const chartBottom = this.height - 26;
    const chartTop = 16;

    const slot = (chartRight - chartLeft) / Math.max(items.length, 1);
    const barW = Math.max(slot * 0.58, 18);

    return items.map((it, idx) => {
      const xCenter = chartLeft + (slot * idx) + (slot / 2);
      const h = ((chartBottom - chartTop) * (it.value / max));
      const y = chartBottom - h;

      return {
        label: it.label,
        x: xCenter - (barW / 2),
        y,
        w: barW,
        h,
      };
    });
  });
}
