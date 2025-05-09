import { OrderDirection } from "../enums/order-direction";
import { CoffeeRecord } from "./coffee-record";

export interface RecordSearchState {
  isLoading: boolean,
  startDate: string | null,
  endDate: string | null,
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
