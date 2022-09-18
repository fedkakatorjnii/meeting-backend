import { Room, User } from 'src/entities';
import {
  AnonMessageToRoom,
  ResponseSocketMessageToRoom,
  SocketMessageToRoom,
} from 'src/shared/redis/dto/message-to-room.dto';

export const isAnonMessageToRoom = (value: any): value is AnonMessageToRoom => {
  if (typeof value.room !== 'number' || typeof value.message !== 'string') {
    return false;
  }

  return true;
};

export const isMessageToRoom = (value: any): value is SocketMessageToRoom => {
  if (typeof value.senderId !== 'number') return false;
  if (!isAnonMessageToRoom(value)) return false;

  return true;
};

const isUser = (value: any): value is User => {
  // TODO
  if (typeof value?.id !== 'number') return false;
  if (typeof value?.username !== 'string') return false;

  return true;
};

const isRoom = (value: any): value is Room => {
  // TODO
  if (typeof value?.id !== 'number') return false;
  if (typeof value?.name !== 'string') return false;

  return true;
};

export const isResponseMessageToRoom = (
  value: any,
): value is ResponseSocketMessageToRoom => {
  // TODO
  if (typeof value?.senderId !== 'number') return false;
  if (typeof value?.room !== 'number') return false;

  if (!value?.message) return false;

  const { message } = value;

  if (typeof message?.id !== 'number') return false;
  if (!message?.owner || !isUser(message.owner)) return false;
  if (!message?.room || !isRoom(message.room)) return false;

  return true;
};
