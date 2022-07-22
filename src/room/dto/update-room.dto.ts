export interface UpdateRoomDto {
  id: number;
  name: string;
  description: string | null;
  owner: string | number;
}
