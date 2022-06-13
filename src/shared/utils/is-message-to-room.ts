import {
  AnonMessageToRoom,
  MessageToRoom,
} from 'src/shared/redis/dto/message-to-room.dto';

export const isAnonMessageToRoom = (value: any): value is AnonMessageToRoom => {
  if (typeof value.room !== 'number' || typeof value.message !== 'string') {
    return false;
  }

  return true;
};

export const isMessageToRoom = (value: any): value is MessageToRoom => {
  if (typeof value.senderId !== 'number') return false;
  if (!isAnonMessageToRoom(value)) return false;

  return true;
};
