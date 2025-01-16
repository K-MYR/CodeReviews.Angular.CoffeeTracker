export interface PaginatedList<T> {
  values: T[],
  hasNext: boolean,
  hasPrevious: boolean,
  orderBy: string,
  orderDirection: number
}
