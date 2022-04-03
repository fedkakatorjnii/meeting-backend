import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Collection, Pagination } from 'src/types';
import { Room, User } from 'src/entities';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';

const getTake = (pagination: Pagination) => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return;

  return _page_size;
};

const getSkip = (pagination: Pagination) => {
  const { _page, _page_size } = pagination;

  if (_page < 1 || _page_size < 0) return;

  return (_page - 1) * _page_size;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async list(pagination: Pagination): Promise<Collection<User>> {
    const { _page, _page_size } = pagination;
    const skip = getSkip(pagination);
    const take = getTake(pagination);

    const [items, total] = await this.usersRepository.findAndCount({
      take,
      skip,
      relations: ['ownsRooms', 'consistsRooms'],
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

  async findByName(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne(
      { username },
      { relations: ['ownsRooms', 'consistsRooms'] },
    );
  }

  async find(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(id, {
      relations: ['ownsRooms', 'consistsRooms'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user = new User();

    user.username = createUserDto.username;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.ownsRooms = [];
    user.consistsRooms = [];

    const errors = await validate(user);

    if (errors.length > 0) throw errors;

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update({ id, ...rest }: UpdateUserDto): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(id);

    user.username = rest.username;
    user.firstName = rest.firstName;
    user.lastName = rest.lastName;
    user.email = rest.email;
    user.password = rest.password;

    const errors = await validate(user);

    if (errors.length > 0) throw errors;

    return this.usersRepository.save(user);
  }

  async addUserToRoom(userId: number, room: Room): Promise<User> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['consistsRooms'],
    });

    console.log('user.consistsRooms', user.consistsRooms);

    if (user.consistsRooms.find((item) => item.id === room.id)) {
      // TODO подумать над обработкой ошибок
      return user;
    }

    user.consistsRooms.push(room);

    return this.usersRepository.save(user);
  }

  async removeUserFromRoom(userId: number, room: Room): Promise<User> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['consistsRooms'],
    });

    console.log('user.consistsRooms', user.consistsRooms);

    if (!user.consistsRooms.find((item) => item.id === room.id)) {
      // TODO подумать над обработкой ошибок
      return user;
    }

    user.consistsRooms = user.consistsRooms.filter(
      (item) => item.id !== room.id,
    );

    return this.usersRepository.save(user);
  }

  async activate(id: Pick<UserDto, 'id'>, isActive: boolean) {
    return this.usersRepository.update(id, { isActive });
  }

  async superuser(id: Pick<UserDto, 'id'>, isSuperuser: boolean) {
    return this.usersRepository.update(id, { isSuperuser });
  }
}
