import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticatedSocket } from '../socket-state/types';
import { RedisPropagatorService } from './redis-propagator.service';

@Injectable()
export class RedisPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>>
{
  public constructor(
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        if (!data) return;

        if (data.event === 'msgToClient') {
          this.redisPropagatorService.propagateSendMessageEvent({
            ...data,
            socketId: socket.id,
            ...socket.auth,
          });
        }

        if (data.event === 'readMsgToClient') {
          this.redisPropagatorService.propagateReadMessagesEvent({
            ...data,
            socketId: socket.id,
            ...socket.auth,
          });
        }

        if (data.event === 'deleteMsgToClient') {
          this.redisPropagatorService.propagateDeleteMessageEvent({
            ...data,
            socketId: socket.id,
            ...socket.auth,
          });
        }

        if (data.event === 'geolocationToClient') {
          this.redisPropagatorService.propagateGeolocationEvent({
            ...data,
            socketId: socket.id,
            ...socket.auth,
          });
        }
      }),
    );
  }
}
