import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @IsNotEmpty()
  owner: User;

  @ManyToOne(() => Room, (user) => user.messages)
  @IsNotEmpty()
  room: Room;
}
