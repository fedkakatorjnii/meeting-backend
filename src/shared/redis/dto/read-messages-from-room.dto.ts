import { SocketMessage } from './user-message.dto';
import { SocketAnonMessage } from './anon-message.dto';
import { Message } from 'src/entities';

export interface AnonReadMessagesFromRoom extends SocketAnonMessage<number[]> {
  room: number;
}

export interface SocketReadMessagesFromRoom extends SocketMessage<number[]> {
  room: number;
}

export interface ResponseSocketReadMessagesFromRoom
  extends SocketMessage<Message[]> {
  room: number;
}
