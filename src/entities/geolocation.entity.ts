import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsOptional, IsDate, IsNotEmpty } from 'class-validator';
import { User } from './user.entity';
import { Point } from 'geojson';

@Entity({ name: 'geolocations' })
export class Geolocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @IsNotEmpty()
  point: Point;

  @ManyToOne(() => User, (user) => user.geolocations)
  @JoinColumn()
  @IsNotEmpty()
  owner: User;

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
