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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Room, User } from 'src/entities';
import { Collection } from 'src/types';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomService } from './room.service';

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

@UseGuards(JwtAuthGuard)
@Controller('api/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<Collection<Room>> {
    try {
      return this.roomService.list();
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
  ): Promise<User> {
    try {
      const user = await this.roomService.addUserToRoom(userId, id);

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsAddUserToRoom,
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
  ): Promise<User> {
    try {
      const user = await this.roomService.removeUserFromRoom(userId, id);

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorRoomsRemoveUserFromRoom,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
