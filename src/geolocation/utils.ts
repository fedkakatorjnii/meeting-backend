import { getNumber, getPaginationOption } from 'src/shared/utils/pagination';
import { PaginatedListGeolocationDto } from './dto';

export const getPaginatedListGeolocationOption = (
  query: any,
): Partial<PaginatedListGeolocationDto> => {
  const { roomId } = query;
  const pagination = getPaginationOption(query);

  return {
    roomId: getNumber(roomId),
    ...pagination,
  };
};
