import { FormControl } from "@angular/forms"

export interface PostLogin {
  email: string,
  password: string,
  rememberMe: boolean
}

export interface PostLoginForm {
  email: FormControl<string>,
  password: FormControl<string>,
  rememberMe: FormControl<boolean>
}
