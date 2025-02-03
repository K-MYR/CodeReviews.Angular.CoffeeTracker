import { FormControl } from "@angular/forms";

export interface PutCoffeeRecordForm {
  id: FormControl<number | null>,
  type: FormControl<string | null>,
  dateTime: FormControl<string | null>
}
