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
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from 'src/auth/auth.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access-token.guard';
import {
  getPaginatedCollectionResponse,
  getPaginationOption,
} from 'src/shared/utils/pagination';
import { AuthUser } from 'src/common/halpers';
import { Message } from 'src/entities';
import { PaginatedCollectionResponse } from 'src/types';

import { getPaginatedListMessageOption } from './utils';
import { MessagesService } from './messages.service';
import { PaginatedListMessageDto } from './dto';
import { MessagesCollectionToRoomsResponse } from './types';

enum ErrorMessagesFind {
  general = 'Не удалось получить сообщение.',
  invalidId = 'Не валидный идентификатор сообщения.',
  invalidUserId = 'Не валидный идентификатор пользователя.',
  invalidUserName = 'Не валидное имя пользователя.',
}

enum ErrorMessagesList {
  general = 'Не удалось получить список сообщений.',
}

enum ErrorMessageRemove {
  general = 'Не удалось удалить сообщение.',
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.messagesService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessageRemove.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('rooms')
  @HttpCode(HttpStatus.OK)
  async listToRooms(
    @Headers('host') host,
    @Query() query: PaginatedListMessageDto,
    @AuthUser() user,
  ): Promise<MessagesCollectionToRoomsResponse> {
    try {
      const url = `${host}/${uri}`;
      const messagePaginatedListOption = getPaginationOption(query);
      const messagesToRooms = await this.messagesService.listToRooms(
        messagePaginatedListOption,
        user,
      );

      return messagesToRooms.map(({ room, messages }) => ({
        room,
        messages: getPaginatedCollectionResponse(url, messages),
      }));
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

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Headers('host') host,
    @Query() query: PaginatedListMessageDto,
    @AuthUser() user,
  ): Promise<PaginatedCollectionResponse<Message>> {
    try {
      const url = `${host}/${uri}`;
      const messagePaginatedListOption = getPaginatedListMessageOption(query);

      const messages = await this.messagesService.list(
        messagePaginatedListOption,
        user,
      );

      return getPaginatedCollectionResponse(url, messages);
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string, @AuthUser() user): Promise<Message> {
    try {
      const messageId = Number(id);

      if (Number.isNaN(messageId)) {
        throw new Error(ErrorMessagesFind.invalidId);
      }

      const messages = await this.messagesService.find(messageId, user);

      return messages;
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
}
