import { Pagination } from 'src/types';

export interface PaginatedListMessageDto extends Pagination {
  roomId: number;
  ownerId: number;
}
