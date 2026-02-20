import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DbDashboardFacade, DB_DASHBOARD_PROVIDERS } from '../../../application/db-dashboard.facade';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { DbPanelComponent } from '../../components/db-panel/db-panel.component';

/**
 * Página principal del dashboard.
 * - Mantiene template limpio
 * - delega render a componentes
 */
@Component({
  selector: 'app-db-management-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TopNavComponent,
    DbPanelComponent,
  ],
  templateUrl: './db-management-dashboard.page.html',
  styleUrl: './db-management-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [...DB_DASHBOARD_PROVIDERS],
})
export class DbManagementDashboardPage implements OnInit {
  constructor(
    public readonly facade: DbDashboardFacade,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.facade.load();
  }

  onRefresh(): void {
    this.facade.load();
    this.snackBar.open('Actualizando métricas...', 'OK', { duration: 1500 });
  }
}
