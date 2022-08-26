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
import { MessageToRoom } from 'src/shared/redis/dto/message-to-room.dto';
import { AuthenticatedSocket } from 'src/shared/socket-state/types';
import { isAnonMessageToRoom } from 'src/shared/utils/is-message-to-room';
import { MessagesService } from 'src/messages/messages.service';
import { EventsService } from './events.service';
import { RedisSocketEventNames } from 'src/shared/redis-propagator/redis-propagator.constants';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { GeolocationMessate } from 'src/shared/redis/dto/geolocation.dto';
import { isAnonGeolocation } from 'src/shared/utils/is-geolocation';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MainGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private eventsService: EventsService,
    private messagesService: MessagesService,
    private geolocationService: GeolocationService,
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MainGateway');

  @SubscribeMessage('msgToServer')
  async handleMessage(
    client: AuthenticatedSocket,
    payload: any,
  ): Promise<{
    event: 'msgToClient';
    target: RedisSocketEventNames;
    data: MessageToRoom;
  }> {
    let data = payload;

    if (typeof payload === 'string') {
      data = JSON.parse(payload);
    }

    if (!isAnonMessageToRoom(data)) return;

    await this.messagesService.create({
      text: data.message,
      ownerId: client.auth.userId,
      roomId: data.room,
    });

    return {
      event: 'msgToClient',
      target: RedisSocketEventNames.chat,
      data: {
        ...data,
        senderId: client.auth.userId,
      },
    };
  }

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
        ownerId: client.auth.userId,
      });

      return {
        event: 'geolocationToClient',
        target: RedisSocketEventNames.geolocation,
        data: {
          ...data,
          senderId: client.auth.userId,
        },
      };
    } catch (error) {}
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    try {
      this.logger.log(
        `User ${socket.auth.username} (${socket.auth.userId}) has been connected.`,
      );
    } catch (error) {
      socket.disconnect();
    }
  }
}
