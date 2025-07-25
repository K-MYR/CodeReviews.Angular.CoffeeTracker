import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';
import { ResendEmail, ResendEmailForm } from '../../../interfaces/resend-email';
import { AuthService } from '../../../services/auth.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountInfo } from '../../../interfaces/account-info';

@Component({
  selector: 'app-resend-email',
  imports: [ReactiveFormsModule, HexButtonComponent],
  templateUrl: './resend-email.component.html',
  styleUrl: './resend-email.component.scss',
  standalone: true,
})
export class ResendEmailComponent {
  private authService = inject(AuthService);
  resendEmailForm = new FormGroup<ResendEmailForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  resendEmail(): void {  
    var data = this.resendEmailForm.value;
    if (data.email) {
      var resendEmail: ResendEmail = {
        email: data.email
      }
      this.authService.resendEmail(resendEmail)
        .subscribe({
          next: _ => console.log("Email resend!"),
          error: _ => console.log("Error resending the mail")
        });
    }
  }
}
