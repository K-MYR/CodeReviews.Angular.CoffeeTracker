import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordSearchState {
  isLoading: boolean,
  from: string | null,
  to: string | null,
  type: string | null,
  lastId: number | null,
  lastValue: string | number | null,
  isPrevious: boolean,
  page: number,
  pageSize: number,
  hasPrevious: boolean,
  hasNext: boolean,
  orderBy: keyof CoffeeRecord,
  orderDirection: OrderDirection,
  records: CoffeeRecord[],
}
