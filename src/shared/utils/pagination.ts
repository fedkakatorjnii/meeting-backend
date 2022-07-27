import {
  Pagination,
  PaginationLinks,
  QueryPagination,
  PaginationLinkProps,
} from 'src/types';

export const getTake = (pagination: Partial<Pagination>): number => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return 10;

  return _page_size;
};

export const getSkip = (pagination: Partial<Pagination>): number => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return 1;

  return (_page - 1) * _page_size;
};

export const getNumber = (value: any) => {
  const res = Number(value);

  if (Number.isNaN(res)) return;

  return res;
};

export const getPagination = (
  pagination: Partial<Pagination>,
): QueryPagination => {
  const skip = getSkip(pagination);
  const take = getTake(pagination);

  return { skip, take };
};

export const getPaginationOption = (query: any): Partial<Pagination> => {
  const { _page, _page_size } = query;

  return {
    _page: getNumber(_page) || 1,
    _page_size: getNumber(_page_size) || 10,
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
