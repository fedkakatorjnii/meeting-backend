import { ApiPropertyOptional } from '@nestjs/swagger';

import { Pagination } from 'src/types';

export class PaginatedListRoomsMessageDto implements Pagination {
  @ApiPropertyOptional()
  _page: number;

  @ApiPropertyOptional()
  _page_size: number;
}
