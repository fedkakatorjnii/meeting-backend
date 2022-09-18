import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { Point } from 'geojson';

import { Geolocation } from 'src/entities';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { PaginatedCollection } from 'src/types';
import { getLinks, getPagination } from 'src/shared/utils/pagination';

import { CreateGeolocationDto, PaginatedListGeolocationDto } from './dto';

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
  ): Promise<PaginatedCollection<Geolocation>> {
    const { ownerId, _page, _page_size } = query;
    const { skip, take } = getPagination(query);
    const owner = await this.userService.find(ownerId);

    const mainPrefix = 'geolocation';
    const selectQueryBuilder = this.geolocationRepository
      .createQueryBuilder(mainPrefix)
      .where('geolocation.owner = :owner')
      .setParameters({ owner: owner.id })
      .skip(skip)
      .take(take);

    const [items, total] = await selectQueryBuilder.getManyAndCount();

    const page = _page;
    const size = _page_size;

    const links = getLinks({
      page,
      size,
      total,
    });

    return {
      items,
      total,
      page,
      size,
      links,
    };
  }

  async create({ ownerId, coordinates }: CreateGeolocationDto) {
    const geolocation = new Geolocation();

    const owner = await this.userService.find(ownerId);
    const point: Point = {
      coordinates,
      type: 'Point',
    };

    geolocation.owner = owner;
    geolocation.point = point;

    const errors = await validate(geolocation);

    if (errors.length > 0) throw errors;

    return this.geolocationRepository.save(geolocation);
  }
}
