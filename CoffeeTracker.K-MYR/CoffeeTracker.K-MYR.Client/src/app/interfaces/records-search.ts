import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordsSearch {
  startDate?: string,
  endDate?: string,
  type?: string,
  lastId?: number,
  lastValue?: string | number,
  pageSize?: number,
  isPrevious?: boolean,
  orderBy: keyof CoffeeRecord,
  orderDirection: OrderDirection,
}
