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

export interface Pagination {
  _page: number;
  _page_size: number;
}

export interface QueryPagination {
  skip: number;
  take: number;
}

export interface jwtPayload {
  username: string;
  iat: number;
  exp: number;
}
