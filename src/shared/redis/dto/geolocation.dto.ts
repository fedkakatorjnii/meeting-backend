import { Message } from './user-message.dto';
import { AnonMessage } from './anon-message.dto';

export type AnonGeolocationMessate = AnonMessage<[number, number]>;

export type GeolocationMessate = Message<[number, number]>;
