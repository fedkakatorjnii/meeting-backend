import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

import { PaginatedCollection } from 'src/types';
import { Message, Room, User } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { getLinks, getPagination } from 'src/shared/utils/pagination';
import { RoomService } from 'src/room/room.service';

import { PaginatedListMessageDto } from './dto';
import { CreateMessageDto } from './dto';

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

  async #getUser(id: number) {
    const user = await this.userService.find(id);

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
  ): Promise<PaginatedCollection<Message>> {
    const { ownerId, roomId, _page, _page_size } = query;
    const pagination = getPagination(query);
    let owner: User | undefined = undefined;
    let room: Room | undefined = undefined;

    if (ownerId !== undefined) {
      owner = await this.#getUser(ownerId);
    }

    if (roomId !== undefined) {
      room = await this.#getRoomById(roomId);
    }

    const [items, total] = await this.messageRepository.findAndCount({
      ...pagination,
      where: {
        room,
        owner,
      },
    });
    const page = _page;
    const size = _page_size;

    const links = getLinks({
      page,
      size,
      total,
    });

    return {
      items,
      total,
      page,
      size,
      links,
    };
  }

  async findByUser(id: string | number): Promise<Message | undefined> {
    const owner = await this.userService.find(id);

    return this.messageRepository.findOne(
      { owner },
      // { relations: ['owner', 'room'] },
    );
  }

  async find(id: number): Promise<Message | undefined> {
    return this.messageRepository.findOne(id, {
      // relations: ['owner', 'room'],
    });
  }

  async create(data: CreateMessageDto) {
    const owner = await this.#getUser(data.ownerId);
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
