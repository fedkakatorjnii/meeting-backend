import { jwtPayload } from 'src/types';

// lat = latitude = широта
// log = longitude = долгота

export const isPoint = (value: any): value is [number, number] => {
  if (!Array.isArray(value)) return false;
  if (value.length !== 2) return false;

  const [lat, log] = value;

  if (typeof lat !== 'number') return false;
  if (typeof log !== 'number') return false;

  return true;
};

export const isJWTPayload = (value: any): value is jwtPayload => {
  if (typeof value.username !== 'string') return false;
  if (typeof value.iat !== 'number') return false;
  if (typeof value.exp !== 'number') return false;

  return true;
};
