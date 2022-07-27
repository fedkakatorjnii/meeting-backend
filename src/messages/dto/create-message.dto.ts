import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  ownerId: number;
  @ApiProperty()
  roomId: number;
}
