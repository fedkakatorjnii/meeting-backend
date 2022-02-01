import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResourceGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domain: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  lastName: string;

  @Column()
  permission_flags: string;
}
