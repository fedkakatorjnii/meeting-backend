import { Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisClients } from './redis.constants';

export type RedisClient = Redis.Redis;

const config: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return new Redis(config);
    },
    provide: RedisClients.subscriber,
  },
  {
    useFactory: (): RedisClient => {
      return new Redis(config);
    },
    provide: RedisClients.publisher,
  },
];
