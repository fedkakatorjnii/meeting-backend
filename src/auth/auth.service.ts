import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { isJWTPayload } from 'src/common/typeGuards';

enum ErrorMessages {
  invalidToken = 'Неверный токен.',
  userNotFound = 'Пользователь не найден.',
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getUsernameByToken(token: string) {
    const payload = this.jwtService.decode(token);

    if (!isJWTPayload(payload)) return null;

    const { username, exp } = payload;

    const now = new Date().getTime() / 1000;
    const edge = exp - now;

    if (edge < 0) return null;

    return username;
  }

  async validateUserToken(token: string): Promise<User> {
    const username = await this.getUsernameByToken(token);

    // if (!username) return null;
    if (!username) throw new Error(ErrorMessages.invalidToken);

    const user = await this.validateUserUsername(username);

    // if (!user) return null;
    if (!user) throw new Error(ErrorMessages.userNotFound);

    return user;
  }

  async validateUserUsername(username: string): Promise<User> {
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
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
