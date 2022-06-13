import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { RedisPropagatorInterceptor } from 'src/shared/redis-propagator/redis-propagator.interceptor';
import { AuthenticatedSocket } from 'src/shared/socket-state/types';
import { EventsService } from '../events.service';
import { GeolocationMessate } from 'src/shared/redis/dto/geolocation.dto';
import { RedisSocketEventNames } from 'src/shared/redis-propagator/redis-propagator.constants';
import { isAnonGeolocation } from 'src/shared/utils/is-geolocation';
import { GeolocationService } from 'src/geolocation/geolocation.service';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GeolocationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private eventsService: EventsService,
    private geolocationService: GeolocationService,
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('GeolocationGateway');

  @SubscribeMessage('geolocationToServer')
  handleGeolocation(
    client: AuthenticatedSocket,
    payload: any,
  ): {
    target: RedisSocketEventNames;
    event: 'geolocationToClient';
    data: GeolocationMessate;
  } {
    try {
      let data = payload;

      if (typeof payload === 'string') {
        data = JSON.parse(payload);
      }

      if (!isAnonGeolocation(data)) return;

      const geolocation = this.geolocationService.create({
        coordinates: data.message,
        userId: client.auth.userId,
      });

      return {
        target: RedisSocketEventNames.geolocation,
        event: 'geolocationToClient',
        data: {
          ...data,
          senderId: client.auth.userId,
        },
      };
    } catch (error) {}
  }

  afterInit(server: Server) {
    this.logger.log('Geolocation Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    socket.data = {
      ...socket.data,
      target: RedisSocketEventNames.geolocation,
    };
    try {
      this.logger.log(
        `User ${socket.auth.username} (${socket.auth.userId}) has been connected.`,
      );
    } catch (error) {
      socket.disconnect();
    }
  }
}
