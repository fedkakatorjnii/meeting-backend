import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities';
import { ChatGateway } from './gateways/chat.gateway';
import { EventsService } from './events.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ChatGateway, EventsService],
  exports: [ChatGateway],
})
export class EventsModule {}
