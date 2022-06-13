import { AnonMessage } from './anon-message.dto';

export interface Message<T> extends AnonMessage<T> {
  senderId: number;
}
