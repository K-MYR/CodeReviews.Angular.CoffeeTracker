import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Email, EmailForm } from '../../../interfaces/email';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ HexButtonComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  forgotPasswordForm = new FormGroup<EmailForm>({
    email: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  sendEmail(): void {   
    const data = this.forgotPasswordForm.getRawValue();
    const email: Email = {
      email: data.email
    }
    this.authService.forgotPassword(email)
      .subscribe({
        next: _ => console.log("Password reset email sent"),
        error: (error) => console.log(`An error occured resending the mail: ${error}`)
      });
  }
}
