import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthShellComponent } from './components/auth-shell/auth-shell.component';
import { authGuard } from './services/auth.guard';

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },  
  {
    path: 'auth', component: AuthShellComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
  ]},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
]
