import { User } from 'src/entities';

export const isUser = (value: any): value is User => {
  // TODO
  if (typeof value?.id !== 'number') return false;
  if (typeof value?.username !== 'string') return false;

  return true;
};
