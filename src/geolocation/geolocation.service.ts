import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Geolocation } from 'src/entities';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Collection } from 'src/types';
import { PaginatedListGeolocationDto } from './dto/paginated-list-geolocation.dto';
import { getPagination } from 'src/shared/utils/pagination';
import { Point } from 'geojson';
import { CreateGeolocationDto } from './dto/create-geolocation.dto';

enum ErrorMessages {
  userNotFound = 'Пользователь не найдена.',
  roomNotFound = 'Комната не найдена.',
}

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Geolocation)
    private readonly geolocationRepository: Repository<Geolocation>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  async #getUser(userId: number) {
    const user = await this.userService.find(userId);

    if (!user) throw new Error(ErrorMessages.userNotFound);

    return user;
  }

  async list(
    query: Partial<PaginatedListGeolocationDto>,
  ): Promise<Collection<Geolocation>> {
    const { ownerId, _page, _page_size } = query;
    const pagination = getPagination(query);
    // const owner = this.#getUser(ownerId);
    const owner = await this.userService.find(ownerId);

    const [items, total] = await this.geolocationRepository.findAndCount({
      ...pagination,
      where: {
        owner,
      },
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

  async create({ ownerId, coordinates }: CreateGeolocationDto) {
    const geolocation = new Geolocation();

    // const owner = await this.#getUser(ownerId);
    const owner = await this.userService.find(ownerId);
    const point: Point = {
      coordinates,
      type: 'Point',
    };

    geolocation.owner = owner;
    geolocation.date = new Date();
    geolocation.point = point;

    const errors = await validate(geolocation);

    if (errors.length > 0) throw errors;

    return this.geolocationRepository.save(geolocation);
  }
}
