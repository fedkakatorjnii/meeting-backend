import * as bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEmail,
  IsDate,
  IsNotEmpty,
  IsBoolean,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Room } from './room.entity';
import { Message } from './message.entity';
import { Geolocation } from './geolocation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'guest',
    required: true,
    description: 'The unique name of the User',
  })
  @Column({
    unique: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Serega',
    description: 'The first name of the User',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'The last name of the User',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'test@test.ru',
    description: 'The email of the User',
  })
  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ example: 'false' })
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'false' })
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({ example: 'false' })
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isSuperuser: boolean;

  @ApiProperty({ example: 'f0nI2nw/', description: 'The password of the User' })
  @Column('text')
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Не валидный пароль.',
  })
  password: string;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @OneToMany(() => Room, (room) => room.owner, { nullable: false })
  ownsRooms: Room[];

  @ManyToMany(() => Room, { nullable: false })
  @JoinTable()
  consistsRooms: Room[];

  @OneToMany(() => Message, (message) => message.owner, { nullable: false })
  messages: Message[];

  @OneToMany(() => Geolocation, (geolocation) => geolocation.owner, {
    nullable: false,
  })
  geolocations: Geolocation[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
