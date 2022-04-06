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
import { RedisPropagatorInterceptor } from 'src/shared/redis-propagator/redis-propagator.interceptor';
import { MessageToRoom } from 'src/shared/redis/dto/message-to-room.dto';
import { AuthenticatedSocket } from 'src/shared/socket-state/types';
import { isMessageToRoom } from 'src/shared/utils/types';
import { EventsService } from '../events.service';
import { MessagesService } from 'src/messages/messages.service';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private eventsService: EventsService,
    private messagesService: MessagesService,
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  async handleMessage(
    client: AuthenticatedSocket,
    payload: any,
  ): Promise<{
    event: 'msgToClient';
    data: MessageToRoom;
  }> {
    let data = payload;

    if (typeof payload === 'string') {
      data = JSON.parse(payload);
    }

    if (!isMessageToRoom(payload)) return;

    await this.messagesService.create({
      text: payload.message,
      ownerId: client.auth.userId,
      roomId: payload.room,
    });

    return {
      event: 'msgToClient',
      data: {
        ...payload,
        senderId: client.auth.userId,
      },
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
