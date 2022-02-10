export interface CreateRoomDto {
  name: string;
  description: string | null;
  owner: number;
}
