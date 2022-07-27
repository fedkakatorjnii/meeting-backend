import { ApiPropertyOptional } from '@nestjs/swagger';

import { Pagination } from 'src/types';

export class PaginatedListMessageDto implements Pagination {
  @ApiPropertyOptional()
  roomId: number;

  @ApiPropertyOptional()
  ownerId: number;

  @ApiPropertyOptional()
  _page: number;

  @ApiPropertyOptional()
  _page_size: number;
}
