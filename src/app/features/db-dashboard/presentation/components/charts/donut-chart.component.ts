import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Donut chart con SVG.
 * Renderiza % principal + secundario (Indexed/Unindexed).
 */
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="donut">
      <svg viewBox="0 0 120 120" class="svg" role="img" aria-label="Donut chart">
        <circle cx="60" cy="60" r="44" class="track"></circle>
        <circle
          cx="60" cy="60" r="44"
          class="progress"
          [attr.stroke-dasharray]="dasharray()"
          stroke-linecap="round"
        ></circle>

        <text x="60" y="58" text-anchor="middle" class="big">{{ percent }}%</text>
        <text x="60" y="74" text-anchor="middle" class="small">{{ title }}</text>
      </svg>

      <div class="legend">
        <div class="row">
          <span class="swatch primary"></span>
          <span>{{ title }} {{ percent }}%</span>
        </div>
        <div class="row">
          <span class="swatch secondary"></span>
          <span>{{ secondaryLabel }} {{ secondaryPercent }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .donut { display: grid; place-items: center; gap: 10px; }
    .svg { width: 170px; height: 170px; transform: rotate(-90deg); }
    .track { fill: none; stroke: rgba(255,255,255,0.10); stroke-width: 12; }
    .progress { fill: none; stroke: rgba(120,255,190,0.85); stroke-width: 12; }
    .big { fill: rgba(232,238,252,0.95); font-size: 18px; font-weight: 900; transform: rotate(90deg); transform-origin: 60px 60px; }
    .small { fill: rgba(232,238,252,0.75); font-size: 10px; font-weight: 800; transform: rotate(90deg); transform-origin: 60px 60px; }
    .legend { width: 100%; display: grid; gap: 6px; }
    .row { display: flex; gap: 8px; align-items: center; color: rgba(232,238,252,0.85); font-size: 12px; font-weight: 700; }
    .swatch { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
    .swatch.primary { background: rgba(120,255,190,0.85); }
    .swatch.secondary { background: rgba(255,255,255,0.18); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) percent!: number;
  @Input({ required: true }) secondaryLabel!: string;
  @Input({ required: true }) secondaryPercent!: number;

  private readonly circumference = 2 * Math.PI * 44;

  readonly dasharray = computed(() => {
    const p = Math.min(Math.max(this.percent ?? 0, 0), 100);
    const filled = (this.circumference * (p / 100));
    const rest = this.circumference - filled;
    return `${filled} ${rest}`;
  });
}
