import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Message } from 'src/entities';
import { getPaginatedListMessageOption } from './utils';
import { Collection } from 'src/types';
import { MessagesService } from './messages.service';
import { PaginatedListMessageDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('api/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: Omit<PaginatedListMessageDto, 'ownerId'>,
  ): Promise<Collection<Message>> {
    const messagePaginatedListOption = getPaginatedListMessageOption(query);

    return this.messagesService.list(messagePaginatedListOption);
  }
}
