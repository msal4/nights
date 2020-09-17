export interface PaginatedResults<T> {
  count: number
  next: string
  previous: string
  results: T
}
