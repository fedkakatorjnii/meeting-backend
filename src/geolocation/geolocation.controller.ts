import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { Geolocation } from 'src/entities';
import { getPaginatedListMessageOption } from 'src/messages/utils';
import { getCurrentLinks } from 'src/shared/utils/pagination';
import { PaginatedCollectionResponse } from 'src/types';

import { PaginatedListGeolocationDto } from './dto';
import { GeolocationService } from './geolocation.service';

enum ErrorGeolocationList {
  general = 'Не удалось получить список пользователей.',
}

const uri = 'api/geolocations';

@ApiBearerAuth()
@ApiTags('geolocations')
@UseGuards(JwtAuthGuard)
@Controller(uri)
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Headers('host') host,
    @Query() query: PaginatedListGeolocationDto,
  ): Promise<PaginatedCollectionResponse<Geolocation>> {
    try {
      const url = `${host}/${uri}`;
      const messagePaginatedListOption = getPaginatedListMessageOption(query);

      const { links, ...rest } = await this.geolocationService.list(
        messagePaginatedListOption,
      );
      const currentLinks = getCurrentLinks(url, links);

      return { ...rest, ...currentLinks };
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
