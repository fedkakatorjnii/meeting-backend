import {
  getNumberArray,
  getPaginationOption,
} from 'src/shared/utils/pagination';
import { PaginatedListUsersDto } from './dto';

export const getPaginatedListUserOption = (
  query: any,
): Partial<PaginatedListUsersDto> => {
  const roomIds = getNumberArray(query.roomIds);
  const pagination = getPaginationOption(query);

  return {
    roomIds,
    ...pagination,
  };
};
