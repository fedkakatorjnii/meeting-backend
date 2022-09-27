import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, IsOptional, IsDate } from 'class-validator';
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

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  photo: string;

  @OneToMany(() => Message, (message) => message.room, { nullable: false })
  messages: Message[];

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
