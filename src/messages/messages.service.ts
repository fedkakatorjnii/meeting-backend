import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from 'src/types';
import { Message } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { PaginatedListMessageDto } from './dto';
import { getPagination } from 'src/shared/utils/pagination';
import { RoomService } from 'src/room/room.service';
import { CreateMessageDto } from './dto';
import { validate } from 'class-validator';

enum ErrorMessages {
  USER_NOT_FOUND = 'Пользователь не найдена.',
  ROOM_NOT_FOUND = 'Комната не найдена.',
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  async #getUserById(userId: number) {
    const user = await this.userService.find(userId);

    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    return user;
  }

  async #getUserByUserName(username: string) {
    const user = await this.userService.findByName(username);

    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    return user;
  }

  async #getRoomById(roomId: number) {
    const room = await this.roomService.find(roomId);

    if (!room) throw new Error(ErrorMessages.ROOM_NOT_FOUND);

    return room;
  }

  async list(
    query: Partial<PaginatedListMessageDto>,
  ): Promise<Collection<Message>> {
    const { ownerId, roomId, _page, _page_size } = query;
    const pagination = getPagination(query);

    const owner = this.#getUserById(ownerId);
    const room = this.#getRoomById(roomId);

    const [items, total] = await this.messageRepository.findAndCount({
      ...pagination,
      where: {
        room,
        owner,
      },
    });
    const page = _page;
    const size = _page_size;
    const first = null;
    const next = null;
    const previous = null;
    const last = null;

    return {
      items,
      total,
      page,
      size,
      first,
      next,
      previous,
      last,
    };
  }

  async create(data: CreateMessageDto) {
    const owner = await this.#getUserById(data.ownerId);
    const room = await this.#getRoomById(data.roomId);

    const message = new Message();

    message.owner = owner;
    message.room = room;
    message.text = data.text;

    const errors = await validate(message);

    if (errors.length > 0) throw errors;

    return this.messageRepository.save(message);
  }
}
