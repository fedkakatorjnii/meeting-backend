import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

import { PaginatedCollection } from 'src/types';
import { Room, User } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { getLinks } from 'src/shared/utils/pagination';

import { CreateRoomDto, UpdateRoomDto } from './dto';

enum ErrorMessages {
  notValidUserMessage = 'Не валидный пользователь.',
  notFoundRoom = 'Комната не найдена.',
}

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
  ) {}

  async list(user: User): Promise<PaginatedCollection<Room>> {
    const ownsRoomIds = user.ownsRooms.map((item) => item.id);
    const consistsRoomIds = user.consistsRooms.map((item) => item.id);
    const roomIds = [...ownsRoomIds, ...consistsRoomIds];
    const mainPrefix = 'room';

    const selectQueryBuilder = this.roomRepository
      .createQueryBuilder(mainPrefix)
      .leftJoinAndSelect('room.owner', 'owner')
      .where('room.id = any(:roomIds)', { roomIds });

    const [items, total] = await selectQueryBuilder.getManyAndCount();

    const page = 0;
    const size = total;

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

  async findByName(name: string): Promise<Room | undefined> {
    return this.roomRepository.findOne({ name });
  }

  async find(id: number): Promise<Room | undefined> {
    return this.roomRepository.findOne(id, {
      relations: ['owner'],
    });
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room | undefined> {
    const room = new Room();
    const owner = await this.userService.find(createRoomDto.owner);

    if (!owner) throw new Error(ErrorMessages.notValidUserMessage);

    room.name = createRoomDto.name;
    room.description = createRoomDto.description;
    room.owner = owner;

    const errors = await validate(room);

    if (errors.length > 0) throw errors;

    return this.roomRepository.save(room);
  }

  async update({ id, ...rest }: UpdateRoomDto): Promise<Room | undefined> {
    const room = await this.roomRepository.findOne(id);
    const owner = await this.userService.find(rest.owner);

    if (!owner) throw new Error(ErrorMessages.notValidUserMessage);

    room.name = rest.name;
    room.description = rest.description;
    room.owner = owner;

    const errors = await validate(room);

    if (errors.length > 0) throw errors;

    return this.roomRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    await this.roomRepository.delete(id);
  }

  async addUserToRoom(userId: number, roomId: number): Promise<boolean> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) throw new Error(ErrorMessages.notFoundRoom);

    return this.userService.addUserToRoom(userId, room);
  }

  async removeUserFromRoom(userId: number, roomId: number): Promise<boolean> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) throw new Error();

    return this.userService.removeUserFromRoom(userId, room);
  }
}
