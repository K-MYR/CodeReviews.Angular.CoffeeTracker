import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthShellComponent } from './components/auth/auth-shell/auth-shell.component';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';
import { authGuard } from './route-guards/auth.guard';
import { emailQueryParamsGuard } from './route-guards/query-params.guard';
import { ResendEmailComponent } from './components/auth/resend-email/resend-email.component';
import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },  
  { path: 'auth', component: AuthShellComponent, children: [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'confirm-email', component: ConfirmEmailComponent, canActivate: [emailQueryParamsGuard] },
    { path: 'resend-email', component: ResendEmailComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [emailQueryParamsGuard] }
  ]},
  { path: '**', redirectTo: 'dashboard' }
]
