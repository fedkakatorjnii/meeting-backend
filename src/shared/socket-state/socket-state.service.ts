import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticatedSocket } from './types';

@Injectable()
export class SocketStateService {
  private socketState = new Map<number, AuthenticatedSocket[]>();

  public remove(userId: number, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, sockets);
    }

    return true;
  }

  public add(userId: number, socket: AuthenticatedSocket): boolean {
    const existingSockets = this.socketState.get(userId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public get(userId: number): AuthenticatedSocket[] {
    return this.socketState.get(userId) || [];
  }

  public getFromRoom(roomId: number): AuthenticatedSocket[] {
    const res: AuthenticatedSocket[] = [];

    this.socketState.forEach((sockets) =>
      res.push(
        ...sockets.filter(
          ({ auth: { consistsRooms, ownsRooms } }) =>
            consistsRooms.includes(roomId) || ownsRooms.includes(roomId),
        ),
      ),
    );

    return res;
  }

  public getAll(): Socket[] {
    const all = [];

    this.socketState.forEach((sockets) => all.push(sockets));

    return all;
  }
}
