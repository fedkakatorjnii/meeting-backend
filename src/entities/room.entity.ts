import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => User, (user) => user.rooms)
  owner: User;
}
