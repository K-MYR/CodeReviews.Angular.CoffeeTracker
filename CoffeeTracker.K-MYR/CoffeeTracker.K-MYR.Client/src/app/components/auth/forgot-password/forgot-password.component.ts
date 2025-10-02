import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Email, EmailForm } from '../../../interfaces/email';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';
import { withMessage } from '../../../helpers/angular-extensions';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ HexButtonComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  forgotPasswordForm = new FormGroup<EmailForm>({
    email: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  sendEmail(): void {   
    const data = this.forgotPasswordForm.getRawValue();
    const email: Email = {
      email: data.email
    }
    this.authService.forgotPassword(email)
      .pipe(
        withMessage(
          this.notificationService,
          "Sending request...",
          "If the email is valid, a message with instructions is on its way to your inbox.",
          "Sorry, something went wrong. Please try again."
        )
      )
      .subscribe();
  }
}
