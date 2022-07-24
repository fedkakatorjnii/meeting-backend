import { getColumnsWithPrefix } from 'src/common/halpers';
import { SafeUserColumns } from 'src/common/types';

const safeUserColumns: SafeUserColumns = [
  'id',
  'username',
  'firstName',
  'lastName',
  'email',
  'isActive',
  'isDeleted',
  'isSuperuser',
  // 'password',
  'createdAt',
  'updatedAt',
  // 'ownsRooms',
  // 'consistsRooms',
];

export const getUserColumns = (
  isSafe: boolean,
  prefix?: string,
): SafeUserColumns | undefined => {
  if (!isSafe) return;

  if (!prefix) return safeUserColumns;

  return getColumnsWithPrefix(safeUserColumns, prefix) as SafeUserColumns;
};
