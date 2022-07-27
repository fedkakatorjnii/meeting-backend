export interface Collection<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface PaginatedCollection<T> extends Collection<T> {
  links: PaginationLinks;
}

export interface PaginatedCollectionResponse<T> extends Collection<T> {
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

export interface PaginationLinks {
  first: string | null;
  next: string | null;
  previous: string | null;
  last: string | null;
}

export interface PaginationLinkProps {
  total: number;
  page: number;
  size: number;
}
