import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { isMessageToRoom } from '../utils/is-message-to-room';
import { isGeolocation } from '../utils/is-geolocation';
import { RedisService } from '../redis/redis.service';
import { SocketStateService } from '../socket-state/socket-state.service';
import { RedisSocketEventSendDTO } from '../redis/dto/socket-event-send.dto';
import { RedisSocketEventNames } from './redis-propagator.constants';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(RedisSocketEventNames.chat)
      .pipe(tap(this.consumeChatEvent))
      .subscribe();

    this.redisService
      .fromEvent(RedisSocketEventNames.geolocation)
      .pipe(tap(this.consumeGeolocationEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeChatEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { event, data } = eventInfo;

    if (!isMessageToRoom(data)) return;

    return this.socketStateService
      .getFromRoom(data.room, RedisSocketEventNames.chat)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeGeolocationEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const { event, data } = eventInfo;

    if (!isGeolocation(data)) return;

    return this.socketStateService
      .getFromGateway(RedisSocketEventNames.geolocation)
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateChatEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) return false;

    this.redisService.publish(RedisSocketEventNames.chat, eventInfo);

    return true;
  }

  public propagateGeolocationEvent(
    eventInfo: RedisSocketEventSendDTO,
  ): boolean {
    if (!eventInfo.userId) return false;

    this.redisService.publish(RedisSocketEventNames.geolocation, eventInfo);

    return true;
  }
}
