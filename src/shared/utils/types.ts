import { AnonMessageToRoom } from 'src/shared/redis/dto/message-to-room.dto';

export const isMessageToRoom = (value: any): value is AnonMessageToRoom => {
  if (typeof value.room !== 'number' || typeof value.message !== 'string') {
    return false;
  }

  return true;
};
