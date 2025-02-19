import { FormControl } from "@angular/forms"

export interface PostRegister {
  email: string,
  password: string
}

export interface PostRegisterForm {
  email: FormControl<string>,
  password: FormControl<string>
}
