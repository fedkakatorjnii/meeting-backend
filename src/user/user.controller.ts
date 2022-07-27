import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import { SafeUser } from 'src/common/types';
import {
  getCurrentLinks,
  getPaginationOption,
} from 'src/shared/utils/pagination';
import { PaginatedCollectionResponse, Pagination } from 'src/types';

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

const uri = 'api/users';

@UseGuards(JwtAuthGuard)
@Controller(uri)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Headers('host') host,
    @Query() query: Pagination,
  ): Promise<PaginatedCollectionResponse<SafeUser>> {
    const url = `${host}/${uri}`;

    try {
      const pagination = getPaginationOption(query);

      const { links, ...rest } = await this.userService.list(pagination, true);
      const currentLinks = getCurrentLinks(url, links);

      return { ...rest, ...currentLinks };
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
  async find(@Param('id') id: string): Promise<SafeUser> {
    try {
      return this.userService.find(id, true);
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
  async create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
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

      await this.userService.remove(userId);
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
