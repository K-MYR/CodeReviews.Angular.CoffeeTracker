export interface PaginatedList<T> {
  values: T[],
  hasNext: boolean,
  hasPrevious: boolean,
  isPrevious: boolean,
  orderBy: string,
  orderDirection: number
}
