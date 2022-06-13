import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities';
import { ChatGateway } from './gateways/chat.gateway';
import { GeolocationGateway } from './gateways/geolocation.gateway';
import { EventsService } from './events.service';
import { UserModule } from '../user/user.module';
import { MessagesModule } from 'src/messages/messages.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    MessagesModule,
    GeolocationModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ChatGateway, GeolocationGateway, EventsService],
  exports: [ChatGateway, GeolocationGateway],
})
export class EventsModule {}
