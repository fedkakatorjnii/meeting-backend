import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

import { Collection, Pagination } from 'src/types';
import { Room, User } from 'src/entities';
import { getPagination } from 'src/shared/utils/pagination';
import { SafeUser } from 'src/common/types';
import { getSafeUser } from 'src/common/halpers';

import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { getUserColumns } from './halpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async list(query: Partial<Pagination>): Promise<Collection<User>>;
  async list(
    query: Partial<Pagination>,
    isSafe: true,
  ): Promise<Collection<SafeUser>>;
  async list(query: Partial<Pagination>, isSafe?: boolean) {
    const { _page, _page_size } = query;
    const { skip, take } = getPagination(query);
    const mainPrefix = 'user';
    const columns = getUserColumns(isSafe, mainPrefix);

    const selectQueryBuilder = this.usersRepository
      .createQueryBuilder(mainPrefix)
      .select(columns)
      .leftJoinAndSelect('user.ownsRooms', 'owner')
      .leftJoinAndSelect('user.consistsRooms', 'room')
      .skip(skip)
      .take(take);

    const [items, total] = await selectQueryBuilder.getManyAndCount();

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

  async #findByName(
    username: string,
    isSafe: true,
  ): Promise<SafeUser | undefined>;
  async #findByName(username: string, isSafe: false): Promise<User | undefined>;
  async #findByName(username: string, isSafe: true | false) {
    return this.usersRepository.findOne(
      { username },
      {
        relations: ['ownsRooms', 'consistsRooms'],
        select: getUserColumns(isSafe),
      },
    );
  }

  async #findId(id: number, isSafe: false): Promise<User | undefined>;
  async #findId(id: number, isSafe: true): Promise<SafeUser | undefined>;
  async #findId(id: number, isSafe?: boolean) {
    return this.usersRepository.findOne(id, {
      relations: ['ownsRooms', 'consistsRooms'],
      select: getUserColumns(isSafe),
    });
  }

  async find(id: string | number): Promise<User | undefined>;
  async find(id: string | number, isSafe: true): Promise<SafeUser | undefined>;
  async find(id: string | number, isSafe?: true) {
    const userId = Number(id);

    if (typeof id === 'number' && !Number.isNaN(id)) {
      return this.#findId(id, isSafe);
    }
    if (!Number.isNaN(userId)) return this.#findId(userId, isSafe);
    if (typeof id === 'string') return this.#findByName(id, isSafe);
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser | undefined> {
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

    const newUser = await this.usersRepository.save(user);

    return getSafeUser(newUser);
  }

  async update({ id, ...rest }: UpdateUserDto): Promise<SafeUser | undefined> {
    const user = await this.usersRepository.findOne(id);

    user.username = rest.username;
    user.firstName = rest.firstName;
    user.lastName = rest.lastName;
    user.email = rest.email;
    user.password = rest.password;

    const errors = await validate(user);

    if (errors.length > 0) throw errors;

    const newUser = await this.usersRepository.save(user);

    return getSafeUser(newUser);
  }

  async addUserByUserNameToRoom(
    username: string,
    room: Room,
  ): Promise<boolean> {
    const user = await this.find(username);

    if (user.consistsRooms.find((item) => item.id === room.id)) {
      // TODO подумать над обработкой ошибок
      return false;
    }

    user.consistsRooms.push(room);

    return true;
  }

  async addUserToRoom(userId: number, room: Room): Promise<boolean> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['consistsRooms'],
    });

    if (user.consistsRooms.find((item) => item.id === room.id)) {
      // TODO подумать над обработкой ошибок
      return false;
    }

    user.consistsRooms.push(room);
    await this.usersRepository.save(user);

    return true;
  }

  async removeUserFromRoom(userId: number, room: Room): Promise<boolean> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['consistsRooms'],
    });

    if (!user.consistsRooms.find((item) => item.id === room.id)) {
      // TODO подумать над обработкой ошибок
      return true;
    }

    user.consistsRooms = user.consistsRooms.filter(
      (item) => item.id !== room.id,
    );

    return false;
  }

  async activate(id: Pick<UserDto, 'id'>, isActive: boolean) {
    try {
      await this.usersRepository.update(id, { isActive });
      return true;
    } catch (error) {
      return false;
    }
  }

  async superuser(id: Pick<UserDto, 'id'>, isSuperuser: boolean) {
    try {
      return this.usersRepository.update(id, { isSuperuser });
      return true;
    } catch (error) {
      return false;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.usersRepository.update(id, { isDeleted: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async removeByName(username: string): Promise<boolean> {
    try {
      const user = await this.find(username);

      await this.usersRepository.update(user, { isDeleted: true });

      return true;
    } catch (error) {
      return false;
    }
  }

  async recover(id: number): Promise<boolean> {
    try {
      await this.usersRepository.update(id, { isDeleted: false });
      return true;
    } catch (error) {
      return false;
    }
  }

  async recoverByName(username: string): Promise<boolean> {
    try {
      const user = await this.find(username);

      await this.usersRepository.update(user, { isDeleted: true });

      return true;
    } catch (error) {
      return false;
    }
  }
}
