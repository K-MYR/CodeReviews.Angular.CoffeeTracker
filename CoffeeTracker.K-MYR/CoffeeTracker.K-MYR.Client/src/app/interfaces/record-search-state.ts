import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordSearchState {
  isLoading: boolean,
  from: string | undefined,
  to: string | undefined,
  type: string | undefined,
  lastId: number | undefined,
  lastValue: string | number | undefined,
  isPrevious: boolean,
  page: number,
  pageSize: number,
  hasPrevious: boolean,
  hasNext: boolean,
  orderBy: keyof CoffeeRecord,
  orderDirection: OrderDirection,
  records: CoffeeRecord[],
}
