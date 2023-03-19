import { getNumber, getPaginationOption } from 'src/shared/utils/pagination';
import { PaginatedListMessageDto } from './dto';

export const getPaginatedListMessageOption = (
  query: any,
): Partial<PaginatedListMessageDto> => {
  const { roomId } = query;
  const pagination = getPaginationOption(query);

  return {
    roomId: getNumber(roomId),
    ...pagination,
  };
};
