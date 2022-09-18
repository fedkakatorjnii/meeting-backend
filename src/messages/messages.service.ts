import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

import { PaginatedCollection } from 'src/types';
import { Message, User } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { getLinks, getPagination } from 'src/shared/utils/pagination';
import { RoomService } from 'src/room/room.service';

import {
  PaginatedListMessageDto,
  CreateMessageDto,
  PaginatedListRoomsMessageDto,
  PaginatedListRoomMessageDto,
} from './dto';
import { getMessageColumns } from './halpers';

interface ListToRoomItem {
  roomId: number;
  messages: PaginatedCollection<Message>;
}

enum ErrorMessages {
  USER_NOT_FOUND = 'Пользователь не найдена.',
  ROOM_NOT_FOUND = 'Комната не найдена.',
}

const mainPrefix = 'message';
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
    user: User,
  ): Promise<PaginatedCollection<Message>> {
    const { ownerId, roomId, _page, _page_size } = query;
    const { skip, take } = getPagination(query);

    const selectQueryBuilder = this.messageRepository
      .createQueryBuilder(mainPrefix)
      .leftJoinAndSelect('message.owner', 'owner')
      .leftJoinAndSelect('message.room', 'room')
      .orderBy('message.id', 'DESC')
      .skip(skip)
      .take(take);

    const roomIds = this.#getUserRooms(user);

    if (roomIds.includes(roomId)) {
      selectQueryBuilder
        .andWhere('message.room = :room')
        .setParameter('room', roomId);
    }
    if (ownerId !== undefined) {
      selectQueryBuilder
        .andWhere('message.owner = :owner')
        .setParameter('owner', ownerId);
    }

    const [items_, total] = await selectQueryBuilder.getManyAndCount();
    // TODO подумать где лучше сортировать записи
    const items = items_.sort((a, b) => a.id - b.id);

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

  async find(messageId: number, user: User): Promise<Message | undefined> {
    const columns = getMessageColumns(mainPrefix);
    const roomIds = this.#getUserRooms(user);

    const selectQueryBuilder = this.messageRepository
      .createQueryBuilder(mainPrefix)
      .select(columns)
      .leftJoinAndSelect('message.owner', 'owner')
      .leftJoinAndSelect('message.room', 'room')
      .where('message.id= :messageId', { messageId });

    const message = await selectQueryBuilder.getOne();

    if (!message) throw new Error('Сообщение не найдено');
    if (
      !roomIds.includes(message.owner.id) &&
      !roomIds.includes(message.room.id)
    ) {
      throw new Error('Сообщение не найдено');
    }

    return message;
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

    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
  }

  async listToRooms(
    query: Partial<PaginatedListRoomsMessageDto>,
    user: User,
  ): Promise<Array<ListToRoomItem>> {
    const messagesToRooms: Array<ListToRoomItem> = [];

    const roomIds = this.#getUserRooms(user);

    for (const roomId of roomIds) {
      await this.#getRoomById(roomId);

      const messages = await this.#listToRoom({ ...query, roomId });

      messagesToRooms.push({
        roomId,
        messages,
      });
    }

    return messagesToRooms;
  }

  async #listToRoom(
    query: Partial<PaginatedListRoomMessageDto>,
  ): Promise<PaginatedCollection<Message>> {
    const { roomId, _page, _page_size } = query;
    const { skip, take } = getPagination(query);
    const columns = getMessageColumns(mainPrefix);

    const selectQueryBuilder = this.messageRepository
      .createQueryBuilder(mainPrefix)
      .select(columns)
      .leftJoinAndSelect('message.owner', 'owner')
      .leftJoinAndSelect('message.room', 'room')
      .where('message.room = :roomId', { roomId })
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    const [items_, total] = await selectQueryBuilder.getManyAndCount();
    const items = items_.sort((a, b) => a.id - b.id);

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

  #getUserRooms(user: User) {
    const { ownsRooms, consistsRooms } = user;

    const ownsRoomIds = ownsRooms.map((room) => room.id);
    const consistsRoomIds = consistsRooms.map((room) => room.id);

    return [...ownsRoomIds, ...consistsRoomIds];
  }
}
