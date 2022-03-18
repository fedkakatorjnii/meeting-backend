import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private socketState = new Map<number, Socket[]>();

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

  public add(userId: number, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public get(userId: number): Socket[] {
    return this.socketState.get(userId) || [];
  }

  public getAll(): Socket[] {
    const all = [];

    this.socketState.forEach((sockets) => all.push(sockets));

    return all;
  }
}
