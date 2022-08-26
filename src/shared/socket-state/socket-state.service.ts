import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticatedSocket } from './types';

@Injectable()
export class SocketStateService {
  private socketState = new Map<number, AuthenticatedSocket[]>();

  remove(userId: number, socket: Socket): boolean {
    const gateways = this.socketState.get(userId) || [];
    const newGateways = gateways.filter((s) => s.id !== socket.id);

    this.socketState.set(userId, newGateways);

    return true;
  }

  add(userId: number, socket: AuthenticatedSocket): boolean {
    const gateways = this.socketState.get(userId) || [];

    gateways.push(socket);

    this.socketState.set(userId, gateways);

    return true;
  }

  get(userId: number): AuthenticatedSocket[] {
    return this.socketState.get(userId) || [];
  }

  getFromRoom(roomId: number): AuthenticatedSocket[] {
    const res: AuthenticatedSocket[] = [];

    this.socketState.forEach((gateways) => {
      const newGateways = gateways.filter(
        ({ auth: { consistsRooms, ownsRooms } }) => {
          return consistsRooms.includes(roomId) || ownsRooms.includes(roomId);
        },
      );
      res.push(...newGateways);
    });

    return res;
  }

  getGateways(): AuthenticatedSocket[] {
    const res: AuthenticatedSocket[] = [];

    this.socketState.forEach((gateways) => {
      res.push(...gateways);
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

  getAll(): Socket[] {
    const all = [];

    this.socketState.forEach((gateways) => {
      for (const name in gateways) {
        all.push(gateways[name] || []);
      }
    });

    return all;
  }
}
