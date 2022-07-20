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
import { Room } from './room.entity';
import { Message } from './message.entity';
import { Geolocation } from './geolocation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  username: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isSuperuser: boolean;

  @Column('text')
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
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
