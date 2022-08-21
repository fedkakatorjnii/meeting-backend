import { ApiProperty } from '@nestjs/swagger';

export class JwtRefreshTockenDTO {
  @ApiProperty()
  readonly refresh: string;
}
