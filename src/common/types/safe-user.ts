import { User } from 'src/entities';

export type SafeUser = Omit<User, 'password' | 'hashPasswordBeforeInsert'>;
export type SafeUserColumns = Array<keyof SafeUser>;
