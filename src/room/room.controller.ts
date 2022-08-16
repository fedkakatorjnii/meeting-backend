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

import { getCurrentLinks } from 'src/shared/utils/pagination';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt-access-token.guard';
import { PaginatedCollectionResponse } from 'src/types';
import { AuthUser } from 'src/common/halpers';
import { Room } from 'src/entities';

import { CreateRoomDto, PaginatedListRoomsDto, UpdateRoomDto } from './dto';
import { RoomService } from './room.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

enum ErrorRoomsCreate {
  general = 'Ошибка создания комнаты.',
}

enum ErrorRoomsFind {
  general = 'Не удалось получить комнаты.',
}

enum ErrorRoomsList {
  general = 'Не удалось получить список комнат.',
}

enum ErrorRoomsUpdate {
  general = 'Ошибка изменения комнаты.',
}

enum ErrorRoomsRemove {
  general = 'Не удалось удалить комнаты.',
  invalidId = 'Не корректный идентификатор комнат.',
}

enum ErrorRoomsAddUserToRoom {
  general = 'Ошибка добавления пользователя в комнату.',
}

enum ErrorRoomsRemoveUserFromRoom {
  general = 'Ошибка удаления пользователя из комнаты.',
}

enum SuccessRoomsAddUserToRoom {
  general = 'Ползователь успешно добавле в группу.',
}

enum SuccessRoomsRemoveUserFromRoom {
  general = 'Пользователь удалён из группы.',
}

const uri = 'api/rooms';

@ApiBearerAuth()
@ApiTags('rooms')
@UseGuards(JwtAccessTokenGuard)
@Controller(uri)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Headers('host') host,
    @AuthUser() user,
    @Query() query: PaginatedListRoomsDto,
  ): Promise<PaginatedCollectionResponse<Room>> {
    try {
      const url = `${host}/${uri}`;

      const { links, ...rest } = await this.roomService.list(user);

      const currentLinks = getCurrentLinks(url, links);

      return { ...rest, ...currentLinks };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsList.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string): Promise<Room> {
    try {
      return this.roomService.find(Number(id));
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsFind.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const room = await this.roomService.create(createRoomDto);

      return room;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsCreate.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    try {
      const res = await this.roomService.update({ ...updateRoomDto, id });

      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsUpdate.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return this.roomService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsRemove.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post(':id/add')
  @HttpCode(HttpStatus.OK)
  async addUserToRoom(
    @Param('id') id,
    @Body() { userId }: { userId: number },
  ): Promise<string> {
    try {
      if (!(await this.roomService.addUserToRoom(userId, id))) {
        throw new Error(ErrorRoomsAddUserToRoom.general);
      }

      return SuccessRoomsAddUserToRoom.general;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsAddUserToRoom.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post(':id/remove')
  @HttpCode(HttpStatus.OK)
  async removeUserFromRoom(
    @Param('id') id: number,
    @Body() { userId }: { userId: number },
  ): Promise<string> {
    try {
      if (!(await this.roomService.removeUserFromRoom(userId, id))) {
        throw new Error(ErrorRoomsRemoveUserFromRoom.general);
      }

      return SuccessRoomsRemoveUserFromRoom.general;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsRemoveUserFromRoom.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
