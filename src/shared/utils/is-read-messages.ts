import {
  AnonReadMessagesFromRoom,
  ResponseSocketReadMessagesFromRoom,
  SocketReadMessagesFromRoom,
} from 'src/shared/redis/dto/read-messages-from-room.dto';

const isNumberArray = (values?: number[]): values is number[] => {
  if (!values) return false;

  if (!Array.isArray(values)) return false;

  values.forEach((value) => {
    if (typeof value !== 'number') return false;
  });

  return true;
};

export const isAnonReadMessagedFromRoom = (
  value: any,
): value is AnonReadMessagesFromRoom => {
  if (typeof value.room !== 'number' || !isNumberArray(value.message)) {
    return false;
  }

  return true;
};

export const isMessageToRoom = (
  value: any,
): value is SocketReadMessagesFromRoom => {
  if (typeof value.senderId !== 'number') return false;
  if (!isAnonReadMessagedFromRoom(value)) return false;

  return true;
};

export const isResponseSocketReadMessagesFromRoom = (
  value: any,
): value is ResponseSocketReadMessagesFromRoom => {
  // TODO
  if (typeof value?.senderId !== 'number') return false;
  if (typeof value?.room !== 'number') return false;
  if (!isNumberArray(value?.message)) return false;

  return true;
};
