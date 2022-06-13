import { isPoint } from 'src/common/typeGuards';

import { AnonGeolocationMessate } from 'src/shared/redis/dto/geolocation.dto';

export const isAnonGeolocation = (
  value: any,
): value is AnonGeolocationMessate => {
  if (!Array.isArray(value.message)) return false;
  if (!isPoint(value.message)) return false;

  return true;
};

export const isGeolocation = (value: any): value is AnonGeolocationMessate => {
  if (!isAnonGeolocation(value)) return false;

  return true;
};
