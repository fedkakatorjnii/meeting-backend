import { getColumnsWithPrefix } from 'src/common/halpers';
import { Message } from 'src/entities';

export type ResponseMessage = Omit<Message, 'owner' | 'room'> & {
  ownerId: Message['owner']['id'];
  roomId: Message['room']['id'];
};
type MessageColumns = Array<keyof Message>;
type ResponseMessageColumns = Array<keyof ResponseMessage>;

const messageColumns: MessageColumns = [
  'id',
  'owner',
  'room',
  'text',
  'createdAt',
  'updatedAt',
];

const responseMessageColumns: ResponseMessageColumns = [
  'id',
  'ownerId',
  'roomId',
  'text',
  'createdAt',
  'updatedAt',
];

export const getResponseMessageColumns = (
  prefix?: string,
): ResponseMessageColumns | undefined => {
  if (!prefix) return responseMessageColumns;

  return getColumnsWithPrefix(
    responseMessageColumns,
    prefix,
  ) as ResponseMessageColumns;
};

export const getMessageColumns = (
  prefix?: string,
): MessageColumns | undefined => {
  if (!prefix) return messageColumns;

  return getColumnsWithPrefix(messageColumns, prefix) as MessageColumns;
};
