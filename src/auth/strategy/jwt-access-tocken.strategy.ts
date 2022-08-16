import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/entities';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessTockenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.authService.validateUserUsername(payload.username);

    if (!user) throw new UnauthorizedException('Необходимо авторизоваться.');

    return user;
  }
}
