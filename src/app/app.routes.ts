import { Routes } from '@angular/router';
import { MaestroPageComponent } from './components/maestro-page/maestro-page.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'maestro',
        component: MaestroPageComponent,canActivate: [AuthGuard] 
    }
];
