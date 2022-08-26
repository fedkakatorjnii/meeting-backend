import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities';
import { EventsService } from './events.service';
import { UserModule } from '../user/user.module';
import { MessagesModule } from 'src/messages/messages.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { MainGateway } from './main.gateway';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    MessagesModule,
    GeolocationModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [MainGateway, EventsService],
  exports: [MainGateway],
})
export class EventsModule {}
