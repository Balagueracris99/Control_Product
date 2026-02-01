import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Home } from './shared/home/home';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: Home },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./modules/inventory/inventory-module').then(
            (m) => m.InventoryModule
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/users/pages/user-list/user-list').then((m) => m.UserList),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
