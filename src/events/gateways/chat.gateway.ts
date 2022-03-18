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
import { isPoint } from 'src/common/typeGuards';
import { EventsService } from '../events.service';
import { RedisPropagatorInterceptor } from 'src/shared/redis-propagator/redis-propagator.interceptor';
import { AuthenticatedSocket } from 'src/shared/socket-state/types';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private eventsService: EventsService) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    payload: string,
  ): {
    event: 'msgToClient';
    data: string;
  } {
    return {
      event: 'msgToClient',
      data: payload,
    };
  }

  @SubscribeMessage('geolocationToServer')
  handleGeolocation(
    client: Socket,
    payload: any,
  ): {
    event: 'geolocationToClient';
    data: [number, number];
  } {
    try {
      const data = JSON.parse(payload);

      if (!isPoint(data)) return;

      return {
        event: 'geolocationToClient',
        data,
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
