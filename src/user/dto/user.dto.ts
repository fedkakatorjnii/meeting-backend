import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiPropertyOptional()
  firstName: string;
  @ApiPropertyOptional()
  lastName: string;
  @ApiPropertyOptional()
  isActive: boolean;
  @ApiPropertyOptional()
  isSuperuser: boolean;
  @ApiPropertyOptional()
  categories: any[];
}
