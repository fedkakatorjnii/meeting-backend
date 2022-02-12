import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from 'src/types';
import { Room } from 'src/entities';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { UserService } from 'src/user/user.service';
import { validate } from 'class-validator';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
  ) {}

  async list(): Promise<Collection<Room>> {
    const [items, total] = await this.roomRepository.findAndCount({
      relations: ['owner'],
    });
    const page = 0;
    const size = total;
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

    room.name = rest.name;
    room.description = rest.description;
    room.owner = owner;

    const errors = await validate(room);

    if (errors.length > 0) throw errors;

    return this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    await this.roomRepository.delete(id);
  }
}