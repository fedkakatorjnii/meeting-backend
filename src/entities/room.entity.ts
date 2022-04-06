import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  name: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ManyToOne(() => User, (user) => user.ownsRooms)
  owner: User;

  @OneToMany(() => Message, (message) => message.room, { nullable: false })
  messages: Message[];
}
