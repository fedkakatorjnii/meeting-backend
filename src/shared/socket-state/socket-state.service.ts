import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticatedSocket } from './types';

@Injectable()
export class SocketStateService {
  private socketState = new Map<
    number,
    Record<string, AuthenticatedSocket[]>
  >();

  public remove(userId: number, socket: Socket): boolean {
    const gateways = this.socketState.get(userId) || {};

    if (!gateways) return true;

    for (const name in gateways) {
      gateways[name] = gateways[name].filter((s) => s.id !== socket.id);
    }

    this.socketState.set(userId, gateways);

    return true;
  }

  public add(
    userId: number,
    name: string,
    socket: AuthenticatedSocket,
  ): boolean {
    const gateways = this.socketState.get(userId) || {};

    gateways[name] = gateways[name] || [];

    gateways[name].push(socket);

    this.socketState.set(userId, gateways);

    return true;
  }

  public get(userId: number, name: string): AuthenticatedSocket[] {
    const gateways = this.socketState.get(userId) || {};

    return gateways[name] || [];
  }

  public getFromRoom(roomId: number, name: string): AuthenticatedSocket[] {
    const res: AuthenticatedSocket[] = [];

    this.socketState.forEach((gateways) => {
      const sockets = gateways[name] || [];

      res.push(
        ...sockets.filter(
          ({ auth: { consistsRooms, ownsRooms } }) =>
            consistsRooms.includes(roomId) || ownsRooms.includes(roomId),
        ),
      );
    });

    return res;
  }

  getFromGateway(name: string): AuthenticatedSocket[] {
    const res: AuthenticatedSocket[] = [];

    this.socketState.forEach((gateways) => {
      const sockets = gateways[name] || [];

      res.push(...sockets);
    });

    return res;
  }

  public getAll(): Socket[] {
    const all = [];

    this.socketState.forEach((gateways) => {
      for (const name in gateways) {
        all.push(gateways[name] || []);
      }
    });

    return all;
  }
}
