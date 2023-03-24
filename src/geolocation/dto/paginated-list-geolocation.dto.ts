import { ApiPropertyOptional } from '@nestjs/swagger';

import { Pagination } from 'src/types';

export class PaginatedListGeolocationDto implements Pagination {
  @ApiPropertyOptional()
  ownerId: number;

  @ApiPropertyOptional()
  roomId: number;

  @ApiPropertyOptional()
  _page: number;

  @ApiPropertyOptional()
  _page_size: number;
}
