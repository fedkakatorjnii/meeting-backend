import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly userId: number;
  public readonly socketId: string;
  public readonly username: string;
}
