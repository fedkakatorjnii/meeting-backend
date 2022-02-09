import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class RoomPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsOptional()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @OneToOne(() => User)
  @JoinColumn()
  @IsNumber()
  user: User;

  @OneToOne(() => Room)
  @JoinColumn()
  @IsNumber()
  room: Room;

  @Column({
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  permission: number;
}
