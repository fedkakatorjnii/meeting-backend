import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { Collection } from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async list(): Promise<Collection<User>> {
    const items = await this.usersRepository.find();
    const total = await this.usersRepository.count();
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

  async find(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.username = createUserDto.username;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.categories = createUserDto.categories;

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update({ id, ...rest }: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    user.username = rest.username;
    user.firstName = rest.firstName;
    user.lastName = rest.lastName;
    user.email = rest.email;
    user.password = rest.password;
    user.categories = rest.categories;

    return this.usersRepository.save(user);
  }

  async activate(id: Pick<UserDto, 'id'>, isActive: boolean) {
    return this.usersRepository.update(id, { isActive });
  }

  async superuser(id: Pick<UserDto, 'id'>, isSuperuser: boolean) {
    return this.usersRepository.update(id, { isSuperuser });
  }
}
