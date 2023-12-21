import {Routes} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/components/login/login.component').then(e => e.LoginComponent)
  },
  {
    path: 'maestro',
    loadComponent: () => import('../app/components/maestro-page/maestro-page.component').then(e => e.MaestroPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'sync',
    loadComponent: () => import('../app/components/sync/sync.component').then(e => e.SyncComponent),
    canActivate: [AuthGuard]
  }
];
