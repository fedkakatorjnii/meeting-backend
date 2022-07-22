import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Geolocation } from 'src/entities';
import { getPaginatedListMessageOption } from 'src/messages/utils';
import { Collection } from 'src/types';
import { PaginatedListGeolocationDto } from './dto/paginated-list-geolocation.dto';
import { GeolocationService } from './geolocation.service';

enum ErrorGeolocationList {
  general = 'Не удалось получить список пользователей.',
}

@Controller('api/geolocations')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: PaginatedListGeolocationDto,
  ): Promise<Collection<Geolocation>> {
    try {
      const messagePaginatedListOption = getPaginatedListMessageOption(query);

      return this.geolocationService.list(messagePaginatedListOption);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ErrorGeolocationList.general,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
