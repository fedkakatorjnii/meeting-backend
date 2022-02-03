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
import { ResourceGroup } from '.';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isSuperuser: boolean;

  @Column('text')
  password: string;

  @ManyToMany(() => User)
  @JoinTable()
  categories: ResourceGroup[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
