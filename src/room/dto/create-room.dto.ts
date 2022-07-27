import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  owner: string | number;
}
