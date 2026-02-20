import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Tile de estadísticas.
 * - Angular number pipe retorna string | null, por eso value debe aceptar null.
 */
@Component({
  selector: 'app-stat-tile',
  standalone: true,
  imports: [MatIconModule, MatCardModule],
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatTileComponent {
  @Input({ required: true }) label!: string;

  // ✅ Importante: aceptar null para compatibilidad con pipes
  @Input({ required: true }) value!: string | number | null;

  @Input({ required: true }) icon!: string;

  /**
   * Normaliza para evitar mostrar "null" en pantalla.
   */
  get displayValue(): string | number {
    return this.value ?? '';
  }
}
