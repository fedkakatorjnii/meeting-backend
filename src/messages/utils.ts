import { getNumber, getPaginationOption } from 'src/shared/utils/pagination';
import { PaginatedListMessageDto } from './dto';

export const getPaginatedListMessageOption = (
  query: any,
): Partial<PaginatedListMessageDto> => {
  const { ownerId, roomId } = query;
  const pagination = getPaginationOption(query);

  return {
    ownerId: getNumber(ownerId),
    roomId: getNumber(roomId),
    ...pagination,
  };
};
