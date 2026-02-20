import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  // ✅ Entrada: SIEMPRE login
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // ✅ Login solo si NO estás autenticado
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/presentation/pages/login/login.page').then((m) => m.LoginPage),
  },

  // ✅ Dashboard protegido
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/db-dashboard/presentation/pages/db-management-dashboard/db-management-dashboard.page').then(
        (m) => m.DbManagementDashboardPage,
      ),
  },

  // ✅ Logs protegido (solo se entra desde el menú)
  {
    path: 'logs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/logs/presentation/pages/logs/logs.page').then((m) => m.LogsPage),
  },

  // ✅ Fallback: manda a login (no a logs)
  { path: '**', redirectTo: 'login' },
];
