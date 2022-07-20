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
import { EventsService } from '../events.service';
import { MessagesService } from 'src/messages/messages.service';
import { RedisSocketEventNames } from 'src/shared/redis-propagator/redis-propagator.constants';

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
    target: RedisSocketEventNames;
    event: 'msgToClient';
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
      target: RedisSocketEventNames.chat,
      event: 'msgToClient',
      data: {
        ...data,
        senderId: client.auth.userId,
      },
    };
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    socket.data = {
      ...socket.data,
      target: RedisSocketEventNames.chat,
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