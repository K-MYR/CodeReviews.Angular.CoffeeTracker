import { FormControl } from "@angular/forms";

export interface PostCoffeeRecordForm {
  type: FormControl<string|null>,
  dateTime: FormControl<string|null>
}

export interface PostCoffeeRecord {
  type: string,
  dateTime: string
}
