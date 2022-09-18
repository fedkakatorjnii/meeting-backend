import { ApiPropertyOptional } from '@nestjs/swagger';

import { Pagination } from 'src/types';

export class PaginatedListRoomMessageDto implements Pagination {
  @ApiPropertyOptional()
  roomId: number;

  @ApiPropertyOptional()
  _page: number;

  @ApiPropertyOptional()
  _page_size: number;
}
