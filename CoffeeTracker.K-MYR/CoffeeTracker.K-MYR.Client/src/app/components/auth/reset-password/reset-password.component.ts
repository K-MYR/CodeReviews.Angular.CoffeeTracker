import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';
import { PostResetPassword, PostResetPasswordForm } from '../../../interfaces/post-reset-password';
import { identicalValueValidator, NONIDENTICAL_VALUE_ERROR_KEY} from '../../../validators/same-value.validator';
import { getPropertyFromMap, hasNoNullsFromMap } from '../../../helpers/general';
import { EmailQueryParams } from '../../../interfaces/email-query-params';
import { EMAIL_QUERY_PARAM_KEYS } from '../../../route-guards/query-params.guard';
import { AuthService } from '../../../services/auth.service';
import { withMessage } from '../../../helpers/angular-extensions';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, HexButtonComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private userId!: string;
  private token!: string;
  nonidenticalValueErrorKey = NONIDENTICAL_VALUE_ERROR_KEY;
  resetPasswordForm = new FormGroup<PostResetPasswordForm>({
    newPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  }, { validators: identicalValueValidator<PostResetPasswordForm>('newPassword', 'confirmPassword') });
  private notificationService = inject(NotificationService);;

  ngOnInit(): void {
    const paramMap = this.route.snapshot.queryParamMap;
    const isValid = hasNoNullsFromMap<EmailQueryParams>(paramMap, EMAIL_QUERY_PARAM_KEYS);
    if (!isValid) {
      this.notificationService.addMessage('Invalid link. Redirecting to login...', 'error');
    }
    this.userId = getPropertyFromMap<EmailQueryParams>(paramMap, 'userId')!;
    this.token = getPropertyFromMap<EmailQueryParams>(paramMap, 'code')!;
  }

  resetPassword(): void {
    const data = this.resetPasswordForm.getRawValue();
    const resetPassword: PostResetPassword = {
      userId: this.userId,
      newPassword: data.newPassword,
      resetCode: this.token
    };
    this.authService
      .resetPassword(resetPassword)
      .pipe(
        withMessage(
        this.notificationService,
        "Sending request...",
        "The password was successfully changed.",
        "Sorry, something went wrong. Please try again."
        )
      )
      .subscribe();

  }
}
