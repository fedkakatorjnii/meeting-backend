import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { isResponseMessageToRoom } from '../utils/is-message-to-room';
import { isGeolocation } from '../utils/is-geolocation';
import { RedisService } from '../redis/redis.service';
import { SocketStateService } from '../socket-state/socket-state.service';
import { RedisSocketEventSendDTO } from '../redis/dto/socket-event-send.dto';
import { RedisSocketEventNames } from './redis-propagator.constants';
import { isResponseDeleteMessageFromRoom } from '../utils/is-delete-message-from-room';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(RedisSocketEventNames.sendMessage)
      .pipe(tap(this.consumeSendMessageEvent))
      .subscribe();

    this.redisService
      .fromEvent(RedisSocketEventNames.deleteMessage)
      .pipe(tap(this.consumeDeleteMessageEvent))
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

  private consumeSendMessageEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const { event, data } = eventInfo;

    if (!isResponseMessageToRoom(data)) return;

    return this.socketStateService
      .getFromRoom(data.room)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeDeleteMessageEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const { event, data } = eventInfo;

    console.log('consumeDeleteMessageEvent', data);
    if (!isResponseDeleteMessageFromRoom(data)) return;
    console.log('DELETE OK', data);

    return this.socketStateService
      .getFromRoom(data.room)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeGeolocationEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const { event, data } = eventInfo;

    if (!isGeolocation(data)) return;

    return this.socketStateService
      .getGateways()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateDeleteMessageEvent(
    eventInfo: RedisSocketEventSendDTO,
  ): boolean {
    if (!eventInfo.userId) return false;

    this.redisService.publish(RedisSocketEventNames.deleteMessage, eventInfo);

    return true;
  }

  public propagateSendMessageEvent(
    eventInfo: RedisSocketEventSendDTO,
  ): boolean {
    if (!eventInfo.userId) return false;

    this.redisService.publish(RedisSocketEventNames.sendMessage, eventInfo);

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
