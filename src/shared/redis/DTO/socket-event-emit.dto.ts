import { MessageToRoom } from './message-to-room.dto';

export class RedisSocketEventEmitDTO {
  public readonly event: string;
  public readonly data: MessageToRoom;
}
