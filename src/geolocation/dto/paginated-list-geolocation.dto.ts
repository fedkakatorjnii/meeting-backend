import { Pagination } from 'src/types';

export interface PaginatedListGeolocationDto extends Pagination {
  ownerId: number;
}
