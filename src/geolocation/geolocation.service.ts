import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { EntityManager, Repository } from 'typeorm';
import { Point } from 'geojson';

import { Geolocation, User } from 'src/entities';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { PaginatedCollection } from 'src/types';
import {
  getLinks,
  getNullableLinks,
  getPagination,
} from 'src/shared/utils/pagination';

import { CreateGeolocationDto, PaginatedListGeolocationDto } from './dto';

enum ErrorMessages {
  userNotFound = 'Пользователь не найдена.',
  roomNotFound = 'Комната не найдена.',
}

// минимальное расстояние для создания новой точки (метры)
const MIN_DIST = 5;

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
    const { ownerId, roomId, _page, _page_size } = query;
    const page = _page;
    const size = _page_size;

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

    let userIds = [user.id, ...users.items.map((item) => item.id)];

    if (userIds.includes(ownerId)) {
      userIds = [ownerId];
    } else if (ownerId !== undefined) {
      return {
        items: [],
        total: 0,
        page,
        size,
        links: getNullableLinks(),
      };
    }

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
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const newPointQuery = `
          ST_SetSRID(
            ST_MakePoint(${coordinates.join(', ')}), 4326
          )`;
        const distanceQuery = `
          SELECT 
              ST_Distance(
                ST_Transform("point", 3857),
                ST_Transform(
                  ${newPointQuery},
                  3857
                )
              )
            FROM geolocations 
            WHERE "ownerId" = 1 
            ORDER BY "createdAt" DESC 
            LIMIT 1;`;

        // расстояние между последней и новой точками
        const res: [{ st_distance: number } | undefined] =
          await transactionalEntityManager.query(distanceQuery);
        const dist = res[0]?.st_distance || 0;

        const owner = await this.userService.find(ownerId);
        const point: Point = {
          coordinates,
          type: 'Point',
        };
        let geolocation = new Geolocation();

        if (res.length && dist < MIN_DIST) {
          geolocation = await this.geolocationRepository.findOne({
            where: {
              owner,
            },
            order: { createdAt: 'DESC' },
          });
        }

        geolocation.owner = owner;
        geolocation.point = point;

        const errors = await validate(geolocation);

        if (errors.length > 0) throw errors;

        return this.geolocationRepository.save(geolocation);
      },
    );
  }
}
