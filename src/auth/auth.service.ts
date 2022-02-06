import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

const JWT_ACCESS_TOKEN_SECRET = 'JWT_ACCESS_TOKEN_SECRET';
const JWT_ACCESS_TOKEN_EXPIRATION_TIME = 60 * 15;

const JWT_REFRESH_TOKEN_SECRET = 'JWT_REFRESH_TOKEN_SECRET';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserUsername(username: string): Promise<any> {
    const user = await this.userService.findByName(username);

    if (!user) return null;

    return user;
  }

  async validateUserPassword(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByName(username);

    if (!user) return null;

    const isValid = await bcrypt.compare(pass, user.password);

    if (!isValid) return null;

    const { password, ...result } = user;

    return result;
  }

  async login(user: any) {
    return this.#getTokens({ username: user.username });
  }

  async refresh(user: any) {
    return this.#getTokens({ username: user.username });
  }

  async #getTokens(payload: { username: string }) {
    const access_token = this.jwtService.sign(payload, {
      secret: JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
