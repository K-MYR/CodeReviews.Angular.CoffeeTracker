import { FormControl } from "@angular/forms"

export interface ResendEmail {
  email: string
}

export interface ResendEmailForm {
  email: FormControl<string>
}
