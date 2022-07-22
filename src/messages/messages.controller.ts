import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  HttpException,
  Param,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Message } from 'src/entities';
import { getPaginatedListMessageOption } from './utils';
import { Collection } from 'src/types';
import { MessagesService } from './messages.service';
import { PaginatedListMessageDto } from './dto';

enum ErrorMessagesFind {
  general = 'Не удалось получить сообщение.',
  invalidId = 'Не валидный идентификатор сообщения.',
  invalidUserId = 'Не валидный идентификатор пользователя.',
  invalidUserName = 'Не валидное имя пользователя.',
}

enum ErrorMessagesList {
  general = 'Не удалось получить список сообщений.',
}

@UseGuards(JwtAuthGuard)
@Controller('api/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string): Promise<Message> {
    try {
      const messageId = Number(id);

      if (Number.isNaN(messageId)) {
        throw new Error(ErrorMessagesFind.invalidId);
      }

      return this.messagesService.find(messageId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesFind.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('id') id: string): Promise<Message> {
    try {
      return this.messagesService.findByUser(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesFind.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: Omit<PaginatedListMessageDto, 'ownerId'>,
  ): Promise<Collection<Message>> {
    try {
      const messagePaginatedListOption = getPaginatedListMessageOption(query);

      return this.messagesService.list(messagePaginatedListOption);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesList.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
