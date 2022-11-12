import { isUser, isRoom } from 'src/common/halpers';
import {
  AnonDeleteMessageFromRoom,
  SocketDeleteMessageFromRoom,
  ResponseSocketDeleteMessageFromRoom,
} from 'src/shared/redis/dto/anon-delete-message.dto';

export const isAnonDeleteMessageFromRoom = (
  value: any,
): value is AnonDeleteMessageFromRoom => {
  if (typeof value.room !== 'number' || typeof value.message !== 'number') {
    return false;
  }

  return true;
};

export const isDeleteMessageFromRoom = (
  value: any,
): value is SocketDeleteMessageFromRoom => {
  if (typeof value.senderId !== 'number') return false;
  if (!isAnonDeleteMessageFromRoom(value)) return false;

  return true;
};

export const isResponseDeleteMessageFromRoom = (
  value: any,
): value is ResponseSocketDeleteMessageFromRoom => {
  // TODO
  if (typeof value?.senderId !== 'number') return false;
  if (typeof value?.room !== 'number') return false;
  if (typeof value?.message !== 'number') return false;

  return true;
};
