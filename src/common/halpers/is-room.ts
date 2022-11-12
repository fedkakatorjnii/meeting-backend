import { Room } from 'src/entities';

export const isRoom = (value: any): value is Room => {
  // TODO
  if (typeof value?.id !== 'number') return false;
  if (typeof value?.name !== 'string') return false;

  return true;
};
