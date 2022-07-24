import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SafeUser } from 'src/common/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<SafeUser> {
    const user = await this.authService.validateUserPassword(
      username,
      password,
    );

    if (!user) throw new UnauthorizedException('Необходимо авторизоваться.');

    return user;
  }
}
