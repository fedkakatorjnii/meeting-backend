import { Socket, ServerOptions, Server } from 'socket.io';

interface TokenPayload {
  readonly userId: number;
  readonly username: string;
  readonly ownsRooms: number[];
  readonly consistsRooms: number[];
}

export interface AuthenticatedSocket extends Socket {
  auth: TokenPayload;
}
