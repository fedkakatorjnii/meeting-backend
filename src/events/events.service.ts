import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

enum ErrorMessages {
  invalid_token = 'Неверный токен.',
  user_not_found = 'Пользователь не найден.',
}

@Injectable()
export class EventsService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async connectByToken(token: string) {
    const username = await this.authService.getUsernameByToken(token);
    const user = await this.userService.find(username);

    if (!user) throw new Error(ErrorMessages.user_not_found);

    return user;
  }
}
