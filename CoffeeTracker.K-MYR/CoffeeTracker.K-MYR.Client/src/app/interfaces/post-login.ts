import { FormControl } from "@angular/forms"

export interface PostLogin {
  email: string,
  password: string
}

export interface PostLoginForm {
  email: FormControl<string>,
  password: FormControl<string>
}
