import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { RedisService } from '../redis/redis.service';
import { SocketStateService } from '../socket-state/socket-state.service';

import { RedisSocketEventEmitDTO } from '../redis/dto/socket-event-emit.dto';
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
      .fromEvent(RedisSocketEventNames.sendName)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(RedisSocketEventNames.emitAllName)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(RedisSocketEventNames.emitAuthenticatedName)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, event, data, socketId } = eventInfo;

    return this.socketStateService
      .get(userId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    const { event, data } = eventInfo;

    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(RedisSocketEventNames.sendName, eventInfo);

    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      RedisSocketEventNames.emitAuthenticatedName,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(RedisSocketEventNames.emitAllName, eventInfo);

    return true;
  }
}
