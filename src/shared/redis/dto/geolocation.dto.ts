import { SocketMessage } from './user-message.dto';
import { SocketAnonMessage } from './anon-message.dto';

export type AnonGeolocationMessate = SocketAnonMessage<[number, number]>;

export type GeolocationMessate = SocketMessage<[number, number]>;
