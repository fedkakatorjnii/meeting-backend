import { ApiProperty } from '@nestjs/swagger';

export class GetTockenDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}
