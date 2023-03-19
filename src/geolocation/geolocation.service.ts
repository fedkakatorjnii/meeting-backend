import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { EntityManager, Repository } from 'typeorm';
import { Point } from 'geojson';

import { Geolocation, User } from 'src/entities';
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
    private entityManager: EntityManager,
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
    user: User,
  ): Promise<PaginatedCollection<Geolocation>> {
    const { roomId, _page, _page_size } = query;
    const { skip, take } = getPagination(query);

    let roomIds = [
      ...user.ownsRooms.map((room) => room.id),
      ...user.consistsRooms.map((room) => room.id),
    ];

    if (roomIds.includes(roomId)) {
      roomIds = [roomId];
    }

    const users = await this.userService.list({
      roomIds,
      _page: 0,
      _page_size: 0,
    });
    const userIds = [user.id, ...users.items.map((item) => item.id)];

    const mainPrefix = 'geolocation';
    const selectQueryBuilder = this.geolocationRepository
      .createQueryBuilder(mainPrefix)
      .leftJoinAndSelect('geolocation.owner', 'owner')
      .orderBy('geolocation.createdAt', 'DESC');

    if (roomIds && roomIds.length) {
      selectQueryBuilder.where('"owner"."id" IN (:...userIds)', {
        userIds,
      });
    }

    if (skip) selectQueryBuilder.skip(skip);
    if (take) selectQueryBuilder.take(take);

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
