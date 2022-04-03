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
import { CreateRoomDto } from './dto';
import { RoomService } from './room.service';

@UseGuards(JwtAuthGuard)
@Controller('api/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<Collection<Room>> {
    return this.roomService.list();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string): Promise<Room> {
    return this.roomService.find(Number(id));
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
          error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateRoomDto: CreateRoomDto) {
    try {
      const res = await this.roomService.update({ ...updateRoomDto, id });

      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomService.remove(id);
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
          error,
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
          error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
