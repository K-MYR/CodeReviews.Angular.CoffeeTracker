import { FormControl } from "@angular/forms";
import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordsSearchForm {
  dateTimeFrom: FormControl<string|null>
  dateTimeTo: FormControl<string|null>
  type: FormControl<string|null>
}
export interface RecordsSearchFilter {
  dateTimeFrom?: string,
  dateTimeTo?: string,
  type?: string, 
  orderBy: keyof CoffeeRecord,
  orderDirection: OrderDirection,
}

export interface RecordsSearchParameters {
  dateTimeFrom?: string,
  dateTimeTo?: string,
  type?: string,
  pageSize?: number,
  orderBy: keyof CoffeeRecord,
  lastId?: number
  lastValue?: string | number
  isPrevious: boolean,
}
