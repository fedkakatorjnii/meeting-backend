import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly password: string;
  @ApiPropertyOptional()
  readonly firstName: string;
  @ApiPropertyOptional()
  readonly lastName: string;
}
