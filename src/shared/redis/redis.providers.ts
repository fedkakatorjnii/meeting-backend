import { Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisClients } from './redis.constants';

export type RedisClient = Redis.Redis;

const config: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  name: process.env.REDIS_NAME,
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
