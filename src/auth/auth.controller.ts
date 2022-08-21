import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh-token.guard';
import { JwtRefreshTockenDTO } from './dto/jwt-refresh-token.dto';
import { JwtAccessTockenDTO } from './dto/jwt-access-tocken.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('token')
  async login(@Body() jwtAccessTockenDto: JwtAccessTockenDTO, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @Body() jwtRefreshTockenDto: JwtRefreshTockenDTO,
    @Request() req,
  ) {
    return this.authService.login(req.user);
  }
}
