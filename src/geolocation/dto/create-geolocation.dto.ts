import { ApiProperty } from '@nestjs/swagger';

export class CreateGeolocationDto {
  @ApiProperty()
  coordinates: [number, number];
  @ApiProperty()
  ownerId: number;
}
