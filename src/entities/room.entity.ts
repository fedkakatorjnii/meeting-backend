import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';
import { User } from './user.entity';

@Entity()
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

  @ManyToOne(() => User, (user) => user.rooms)
  owner: User;
}