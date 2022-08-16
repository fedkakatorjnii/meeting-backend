import { ApiProperty } from '@nestjs/swagger';

export class JwtAccessTockenDTO {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}
