import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/constants';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/entities';
import { getPaginationOption } from 'src/shared/utils/pagination';
import { Collection, Pagination } from 'src/types';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

enum ErrorMessagesCreate {
  general = 'Ошибка создания пользователя.',
}

enum ErrorMessagesFind {
  general = 'Не удалось получить пользователя.',
}

enum ErrorMessagesList {
  general = 'Не удалось получить список пользователей.',
}

enum ErrorMessagesUpdate {
  general = 'Ошибка изменения пользователя.',
}

enum ErrorMessagesRemove {
  general = 'Не удалось удалить пользователя.',
  invalidId = 'Не корректный идентификатор пользователя.',
}

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: Pagination): Promise<Collection<User>> {
    try {
      const pagination = getPaginationOption(query);

      return this.userService.list(pagination);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesList.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string): Promise<User> {
    try {
      return this.userService.find(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesFind.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userService.create(createUserDto);

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesCreate.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateUserDto: CreateUserDto) {
    try {
      const res = await this.userService.update({ ...updateUserDto, id });

      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesUpdate.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const userId = Number(id);

      if (Number.isNaN(userId)) {
        // TODO
        throw new Error(ErrorMessagesRemove.invalidId);
      }

      return this.userService.remove(userId);
    } catch (error) {
      //TODO
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorMessagesRemove.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
