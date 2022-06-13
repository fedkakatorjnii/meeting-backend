import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state.service';
import { AuthenticatedSocket } from './types';

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly authService: AuthService,
  ) {
    super(app);
  }

  public create(port: number, options: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const { authorization } = socket.handshake.headers;
        const token = authorization?.replace(/^Bearer /, '');
        const user = await this.authService.validateUserToken(token);
        const { id: userId, username } = user;

        const ownsRooms = user.ownsRooms.map((room) => room.id);
        const consistsRooms = user.consistsRooms.map((room) => room.id);

        const auth = {
          userId,
          username,
          ownsRooms,
          consistsRooms,
        };

        socket.auth = auth;

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return server;
  }

  public bindClientConnect(server: Server, callback): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(
          socket.auth.userId,
          socket.data.target,
          socket,
        );

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);

          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
