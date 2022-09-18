import { ResponseSocketMessageToRoom } from './message-to-room.dto';
import { GeolocationMessate } from './geolocation.dto';

export class RedisSocketEventEmitDTO {
  public readonly event: string;
  public readonly target: string;
  public readonly data: ResponseSocketMessageToRoom | GeolocationMessate;
}
