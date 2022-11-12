import { SocketMessage } from './user-message.dto';
import { SocketAnonMessage } from './anon-message.dto';

export interface AnonDeleteMessageFromRoom extends SocketAnonMessage<number> {
  room: number;
}

export interface SocketDeleteMessageFromRoom extends SocketMessage<number> {
  room: number;
}

export interface ResponseSocketDeleteMessageFromRoom
  extends SocketMessage<number> {
  room: number;
}
