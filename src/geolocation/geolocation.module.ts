import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Geolocation } from 'src/entities';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

@Module({
  imports: [
    UserModule,
    RoomModule,
    AuthModule,
    TypeOrmModule.forFeature([Geolocation]),
  ],
  providers: [GeolocationService],
  controllers: [GeolocationController],
  exports: [GeolocationService],
})
export class GeolocationModule {}
