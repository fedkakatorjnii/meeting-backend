import { User } from 'src/entities';
import { SafeUser } from '../types';

export const getSafeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;

  return safeUser;
};
