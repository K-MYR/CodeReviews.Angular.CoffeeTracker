import { FormControl } from "@angular/forms"

export interface PostResetPassword {
  userId: string,
  newPassword: string,
  resetCode: string
}

export interface PostResetPasswordForm {
  newPassword: FormControl<string>
  confirmPassword: FormControl<string>
}
