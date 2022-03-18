import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { isPoint } from 'src/common/typeGuards';
import { EventsService } from '../events.service';

enum ErrorMessages {
  invalid_token = 'Неверный токен.',
  user_not_found = 'Пользователь не найден.',
}

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
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  @SubscribeMessage('geolocationToServer')
  handleGeolocation(client: Socket, payload: any): void {
    try {
      const value = JSON.parse(payload);

      if (!isPoint(value)) return;

      this.server.emit('geolocationToClient', value);
    } catch (error) {}
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      const { authorization } = socket.handshake.headers;
      const token = authorization?.replace(/^Berer /, '');

      if (!token) throw new Error(ErrorMessages.invalid_token);

      const user = await this.eventsService.connectByToken(token);

      this.logger.log(
        `User ${user.username} (${socket.id}) has been connected.`,
      );
    } catch (error) {
      socket.disconnect();
    }
  }
}
