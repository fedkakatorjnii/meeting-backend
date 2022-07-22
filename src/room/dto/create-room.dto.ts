export interface CreateRoomDto {
  name: string;
  description: string | null;
  owner: string | number;
}
