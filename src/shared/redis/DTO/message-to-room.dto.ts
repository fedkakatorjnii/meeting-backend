export interface AnonMessageToRoom {
  room: number;
  message: string;
}

export interface MessageToRoom extends AnonMessageToRoom {
  senderId: number;
}
