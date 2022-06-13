import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getConnectionOptions } from 'typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { Room, RoomPermission, User, Geolocation, Message } from './entities';
import { RoomModule } from './room/room.module';
import { EventsModule } from './events/events.module';
import { SharedModule } from './shared/shared.module';
import { MessagesModule } from './messages/messages.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      // isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          entities: [User, Room, RoomPermission, Geolocation, Message],
          // TODO разобраться почему не получается подключить все
          // entities: ['../entities/*.{ts,js}'],
          migrations: ['../migrations/*.{ts,js}'],
        }),
    }),
    UserModule,
    AuthModule,
    RoomModule,
    EventsModule,
    MessagesModule,
    GeolocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
