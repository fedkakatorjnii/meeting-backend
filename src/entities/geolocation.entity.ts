import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsOptional, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class Geolocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @IsNotEmpty()
  point: string;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @IsOptional()
  @IsDate()
  date: Date;

  @OneToOne(() => User)
  @JoinColumn()
  @IsNotEmpty()
  @IsNumber()
  user: User;
}
