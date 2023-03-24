import { getNumber, getPaginationOption } from 'src/shared/utils/pagination';
import { PaginatedListGeolocationDto } from './dto';

export const getPaginatedListGeolocationOption = (
  query: any,
): Partial<PaginatedListGeolocationDto> => {
  const { ownerId, roomId } = query;
  const pagination = getPaginationOption(query);

  return {
    roomId: getNumber(roomId),
    ownerId: getNumber(ownerId),
    ...pagination,
  };
};
