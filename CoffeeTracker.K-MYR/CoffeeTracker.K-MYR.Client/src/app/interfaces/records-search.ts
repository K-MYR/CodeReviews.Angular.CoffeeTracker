import { FormControl } from "@angular/forms";
import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordsSearchForm {
  dateTimeFrom: FormControl<string|null>
  dateTimeTo: FormControl<string|null>
  type: FormControl<string|null>
}
export interface RecordsSearch {
  dateTimeFrom?: string,
  dateTimeTo?: string,
  type?: string,
  lastId?: number | undefined,
  lastValue?: string | number | undefined,
  pageSize?: number,
  isPrevious?: boolean,
  orderBy: keyof CoffeeRecord,
  orderDirection: OrderDirection,
}
