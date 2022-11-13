import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @IsNotEmpty()
  owner: User;

  @ManyToMany(() => User, { nullable: false })
  @JoinTable()
  readers: User[];

  @ManyToOne(() => Room, (user) => user.messages, { onDelete: 'CASCADE' })
  @IsNotEmpty()
  room: Room;

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
