import { SocketMessage } from './user-message.dto';
import { SocketAnonMessage } from './anon-message.dto';
import { Message } from 'src/entities';

export interface AnonMessageToRoom extends SocketAnonMessage<string> {
  room: number;
}

export interface SocketMessageToRoom extends SocketMessage<string> {
  room: number;
}

export interface ResponseSocketMessageToRoom extends SocketMessage<Message> {
  room: number;
}
