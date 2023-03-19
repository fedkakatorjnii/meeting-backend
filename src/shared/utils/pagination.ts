import {
  Pagination,
  PaginationLinks,
  QueryPagination,
  PaginationLinkProps,
  PaginatedCollection,
  PaginatedCollectionResponse,
} from 'src/types';

export const getTake = (pagination: Partial<Pagination>): number => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return 0;

  return _page_size;
};

export const getSkip = (pagination: Partial<Pagination>): number => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return 0;

  return (_page - 1) * _page_size;
};

export const getNumber = (value: any, defaultValue?: number) => {
  const res = Number(value);

  if (Number.isNaN(res)) return defaultValue;

  return res;
};

export const getNumberArray = (value: any): number[] | undefined => {
  if (!Array.isArray(value)) return;

  const res: number[] = value.filter((item) => typeof item === 'number');

  return res.length ? res : undefined;
};

export const getPagination = (
  pagination: Partial<Pagination>,
): QueryPagination => {
  const skip = getSkip(pagination);
  const take = getTake(pagination);

  return { skip, take };
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const getPaginationOption = (query: any): Partial<Pagination> => {
  let _page = getNumber(query._page, DEFAULT_PAGE);
  let _page_size = getNumber(query._page_size, DEFAULT_PAGE_SIZE);

  if (!_page_size) {
    _page = 0;
    _page_size = 0;
  }

  return {
    _page: typeof _page === 'number' ? _page : DEFAULT_PAGE,
    _page_size: typeof _page_size === 'number' ? _page_size : DEFAULT_PAGE_SIZE,
  };
};

const getPaginatedLink = (page: number, size: number) =>
  `_page=${page}&_page_size=${size}`;

const getFirstLink = ({ size }: PaginationLinkProps) =>
  getPaginatedLink(1, size);

const getLastLink = (config: PaginationLinkProps) => {
  const { size, total } = config;
  const lastPage = Math.ceil(total / size);

  if (lastPage < 2) return getFirstLink(config);

  return getPaginatedLink(lastPage, size);
};

const getNextLink = (config: PaginationLinkProps) => {
  const { size, total, page } = config;
  const lastPage = Math.ceil(total / size);

  if (lastPage < 2) return null;

  if (page >= lastPage) return null;

  const nextPage = page + 1;

  return getPaginatedLink(nextPage, size);
};

const getPreviousLink = (config: PaginationLinkProps) => {
  const { size, total, page } = config;
  const lastPage = Math.ceil(total / size);

  if (lastPage < 2) return null;

  if (page < 2) return null;

  const prevPage = page - 1;

  return getPaginatedLink(prevPage, size);
};

export const getLinks = (config: PaginationLinkProps): PaginationLinks => {
  const first = getFirstLink(config);
  const last = getLastLink(config);
  const next = getNextLink(config);
  const previous = getPreviousLink(config);

  return {
    first,
    next,
    previous,
    last,
  };
};

const getCurrentLink = (url: string, link: string | null) => {
  if (!link) return null;

  return `${url}?${link}`;
};

export const getCurrentLinks = (
  url: string,
  links: PaginationLinks,
): PaginationLinks => {
  const first = getCurrentLink(url, links.first);
  const last = getCurrentLink(url, links.last);
  const next = getCurrentLink(url, links.next);
  const previous = getCurrentLink(url, links.previous);

  return {
    first,
    next,
    previous,
    last,
  };
};

export const getPaginatedCollectionResponse = <T>(
  url: string,
  list: PaginatedCollection<T>,
): PaginatedCollectionResponse<T> => {
  const currentLinks = getCurrentLinks(url, list.links);

  return { ...list, ...currentLinks };
};
