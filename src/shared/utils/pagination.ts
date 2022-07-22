import { Pagination } from 'src/types';

export const getTake = (pagination: Partial<Pagination>) => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return;

  return _page_size;
};

export const getSkip = (pagination: Partial<Pagination>) => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return;

  return (_page - 1) * _page_size;
};

export const getNumber = (value: any) => {
  const res = Number(value);

  if (Number.isNaN(res)) return;

  return res;
};

export const getPagination = (pagination: Partial<Pagination>) => {
  const skip = getSkip(pagination);
  const take = getTake(pagination);

  return { skip, take };
};

export const getPaginationOption = (query: any): Partial<Pagination> => {
  const { _page, _page_size } = query;

  return {
    _page: getNumber(_page),
    _page_size: getNumber(_page_size),
  };
};
