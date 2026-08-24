import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'months',
    loadComponent: () =>
      import('./features/months/months-list/months-list.component').then((m) => m.MonthsListComponent),
  },
  {
    path: 'months/:id',
    loadComponent: () =>
      import('./features/months/month-detail/month-detail.component').then((m) => m.MonthDetailComponent),
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/stats/stats-compare/stats-compare.component').then((m) => m.StatsCompareComponent),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('./features/import/import-page/import-page.component').then((m) => m.ImportPageComponent),
  },
  { path: '**', redirectTo: '' },
];
