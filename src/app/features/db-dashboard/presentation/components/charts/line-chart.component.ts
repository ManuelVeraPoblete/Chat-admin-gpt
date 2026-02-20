import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinePoint } from '../../../domain/models/db-metrics';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap">
      <div class="header">
        <span class="title">{{ title }}</span>
      </div>

      <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" class="svg" role="img" aria-label="Line chart">
        <polyline [attr.points]="polylinePoints()" class="line"></polyline>

        <ng-container *ngFor="let p of pointsMapped(); let i = index">
          <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3.5" class="dot"></circle>
        </ng-container>
      </svg>
    </div>
  `,
  styles: [`
    .wrap { width: 100%; }
    .header { display:flex; justify-content:flex-end; margin-bottom: 6px; }
    .title { color: rgba(232,238,252,0.75); font-weight: 800; font-size: 12px; }
    .svg { width: 100%; height: 170px; display:block; }
    .line { fill: none; stroke: rgba(120,255,190,0.85); stroke-width: 2.2; }
    .dot { fill: rgba(232,238,252,0.95); stroke: rgba(120,255,190,0.55); stroke-width: 1.2; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  @Input({ required: true }) title!: string;

  @Input({ required: true }) set points(value: LinePoint[]) {
    this._points.set(value ?? []);
  }

  protected readonly width = 520;
  protected readonly height = 190;

  private readonly _points = signal<LinePoint[]>([]);

  readonly pointsMapped = computed(() => {
    const pts = this._points();
    const maxY = Math.max(...pts.map(p => p.y), 1);

    const left = 18;
    const right = this.width - 12;
    const top = 18;
    const bottom = this.height - 16;

    const step = (right - left) / Math.max(pts.length - 1, 1);

    return pts.map((p, idx) => {
      const x = left + (step * idx);
      const y = bottom - ((bottom - top) * (p.y / maxY));
      return { x, y };
    });
  });

  readonly polylinePoints = computed(() => {
    return this.pointsMapped().map(p => `${p.x},${p.y}`).join(' ');
  });
}
