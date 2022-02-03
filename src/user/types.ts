export interface Collection<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  first: string | null;
  next: string | null;
  previous: string | null;
  last: string | null;
}
