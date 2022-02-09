import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Collection, Pagination } from 'src/types';
import { User } from 'src/entities';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async list(pagination: Pagination): Promise<Collection<User>> {
    const { _page, _page_size } = pagination;

    const [items, total] = await this.usersRepository.findAndCount({
      take: _page_size,
      skip: _page * _page_size,
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
    return this.usersRepository.findOne({ username });
  }

  async find(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user = new User();

    user.username = createUserDto.username;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

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

  async activate(id: Pick<UserDto, 'id'>, isActive: boolean) {
    return this.usersRepository.update(id, { isActive });
  }

  async superuser(id: Pick<UserDto, 'id'>, isSuperuser: boolean) {
    return this.usersRepository.update(id, { isSuperuser });
  }
}
