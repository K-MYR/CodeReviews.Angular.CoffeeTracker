import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PostLogin, PostLoginForm } from '../../../interfaces/post-login';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { withMessage } from '../../../helpers/angular-extensions';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HexButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = new FormGroup<PostLoginForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl<boolean>(false, { nonNullable: true })
  });
  private notificationService = inject(NotificationService);

  login(): void {   
    const data = this.loginForm.getRawValue(); 
    const credentials: PostLogin = {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe
    };
    this.authService.login(credentials)
      .pipe(
        withMessage(
          this.notificationService,
          "Sending request...",
          "Login successful! Glad to see you again.",
          "Sorry, something went wrong. Please try again."
        )
      )
      .subscribe(_ => this.router.navigateByUrl("/dashboard"));    
  }
}
