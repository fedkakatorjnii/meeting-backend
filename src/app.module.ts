import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { Room, RoomPermission, User, Geolocation } from './entities';
import { RoomModule } from './room/room.module';
import { EventsModule } from './events/events.module';
import { SharedModule } from './shared/shared.module';
import { ChatGateway } from './events/gateways/chat.gateway';

@Module({
  imports: [
    //
    SharedModule,
    //
    ConfigModule.forRoot({
      // isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          entities: [User, Room, RoomPermission, Geolocation],
          // TODO разобраться почему не получается подключить все
          // entities: ['../entities/*.{ts,js}'],
          migrations: ['../migrations/*.{ts,js}'],
        }),
    }),
    UserModule,
    AuthModule,
    RoomModule,
    //
    // ChatGateway,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //
    // ChatGateway,
    // EventsModule,
  ],
})
export class AppModule {}
