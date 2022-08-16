import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  HttpException,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from 'src/auth/auth.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access-token.guard';
import { getCurrentLinks } from 'src/shared/utils/pagination';
import { Message } from 'src/entities';
import { PaginatedCollectionResponse } from 'src/types';

import { getPaginatedListMessageOption } from './utils';
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

const uri = 'api/messages';

@ApiBearerAuth()
@ApiTags('messages')
@UseGuards(JwtAccessTokenGuard)
@Controller(uri)
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
    @Headers('host') host,
    @Query() query: PaginatedListMessageDto,
  ): Promise<PaginatedCollectionResponse<Message>> {
    try {
      const url = `${host}/${uri}`;
      const messagePaginatedListOption = getPaginatedListMessageOption(query);

      const { links, ...rest } = await this.messagesService.list(
        messagePaginatedListOption,
      );

      const currentLinks = getCurrentLinks(url, links);

      return { ...rest, ...currentLinks };
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
