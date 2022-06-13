import { Message } from './user-message.dto';
import { AnonMessage } from './anon-message.dto';

export interface AnonMessageToRoom extends AnonMessage<string> {
  room: number;
}

export interface MessageToRoom extends Message<string> {
  room: number;
}
