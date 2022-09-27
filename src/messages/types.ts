import { Message, Room } from 'src/entities';
import { PaginatedCollection, PaginatedCollectionResponse } from 'src/types';

export interface MessagesCollectionToRoom {
  // roomId: number;
  room: Room;
  messages: PaginatedCollection<Message>;
}

export interface MessagesCollectionToRoomResponse {
  // roomId: number;
  room: Room;
  messages: PaginatedCollectionResponse<Message>;
}

export type MessagesCollectionToRoomsResponse =
  MessagesCollectionToRoomResponse[];
