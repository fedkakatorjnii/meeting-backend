import * as bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  BeforeUpdate,
} from 'typeorm';
import {
  IsEmail,
  IsDate,
  IsNotEmpty,
  IsBoolean,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ResourceGroup } from '.';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsOptional()
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

  @ManyToMany(() => User)
  @JoinTable()
  @IsOptional()
  categories: ResourceGroup[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
