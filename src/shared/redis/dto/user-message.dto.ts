import { SocketAnonMessage } from './anon-message.dto';

export interface SocketMessage<T> extends SocketAnonMessage<T> {
  senderId: number;
}
