export interface PaginatedList<T> {
  values: T[],
  hasNext: boolean,
  orderBy: string,
  orderDirection: number
}
