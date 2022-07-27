import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  owner: string | number;
}
