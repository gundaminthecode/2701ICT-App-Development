import { Routes } from '@angular/router';
import { LoginGuard } from './services/login.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [LoginGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'edit-trip-modal',
    loadComponent: () => import('./modals/edit-trip-modal/edit-trip-modal.component').then( m => m.EditTripModalComponent)
  },
];
