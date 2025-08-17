import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';
import { Email, EmailForm } from '../../../interfaces/email';
import { AuthService } from '../../../services/auth.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-resend-email',
  imports: [ReactiveFormsModule, HexButtonComponent],
  templateUrl: './resend-email.component.html',
  styleUrl: './resend-email.component.scss',
  standalone: true,
})
export class ResendEmailComponent {
  private authService = inject(AuthService);
  resendEmailForm = new FormGroup<EmailForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  resendEmail(): void { 
     const data = this.resendEmailForm.getRawValue();    
     const resendEmail: Email = {
      email: data.email
    }
    this.authService.resendConfirmationEmail(resendEmail)
      .subscribe({
        next: _ => console.log("Email resent!"),
        error: (error) => console.log(`An error occured resending the mail: ${error}`)
      });    
  }
}
