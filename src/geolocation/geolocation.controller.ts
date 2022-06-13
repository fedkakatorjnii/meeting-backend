import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Geolocation } from 'src/entities';
import { getPaginatedListMessageOption } from 'src/messages/utils';
import { Collection } from 'src/types';
import { PaginatedListGeolocationDto } from './dto/paginated-list-geolocation.dto';
import { GeolocationService } from './geolocation.service';

@Controller('api/geolocations')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: Omit<PaginatedListGeolocationDto, 'ownerId'>,
  ): Promise<Collection<Geolocation>> {
    const messagePaginatedListOption = getPaginatedListMessageOption(query);

    return this.geolocationService.list(messagePaginatedListOption);
  }
}
