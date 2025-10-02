import { AuthService } from '../../../services/auth.service';
import { PostRegister, PostRegisterForm } from '../../../interfaces/post-register';
import { identicalValueValidator, NONIDENTICAL_VALUE_ERROR_KEY } from '../../../validators/same-value.validator';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';

import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY} from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { withMessage } from '../../../helpers/angular-extensions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HexButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  isRegistered = signal<boolean>(false);
  confirmationEmail = signal<string|null>(null);
  nonidenticalValueErrorKey = NONIDENTICAL_VALUE_ERROR_KEY;
  registerForm = new FormGroup<PostRegisterForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  }, { validators: identicalValueValidator<PostRegisterForm>('password', 'confirmPassword') });

  register(): void {   
    const data = this.registerForm.getRawValue();
    const credentials: PostRegister = {
      email: data.email,
      password: data.password
    };
    this.authService.register(credentials)
      .pipe(
        switchMap(() =>
          this.authService
            .login({
              email: credentials.email,
              password: credentials.password,
              rememberMe: false
            })
            .pipe(
              catchError((error) => {
                this.notificationService.addMessage("Automatic login failed", 'error');
                return EMPTY;
              })
            )
        ),
        withMessage(
          this.notificationService,
          "Creating your account...",
          "Registration successful!",
          "Sorry, we couldn’t complete your registration. Please try again."
        )
      )
      .subscribe(_ => {
        this.confirmationEmail.set(credentials.email);
        this.isRegistered.set(true);
      }
    );    
  }

  resendConfirmationEmail(): void {
    const emailAddress = this.confirmationEmail();
    if (!emailAddress) {
      return;
    }
    this.authService
      .resendConfirmationEmail({
        email: emailAddress
      })
      .pipe(
        withMessage(
          this.notificationService,
          "Sending request...",
          "If the email is valid, a confirmation message is on its way to your inbox.",
          "Sorry, something went wrong. Please try again."
        )
      )
      .subscribe();
  }
}
