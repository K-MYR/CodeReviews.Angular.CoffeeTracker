import { FormControl } from "@angular/forms"

export interface Email {
  email: string
}

export interface EmailForm {
  email: FormControl<string>
}
