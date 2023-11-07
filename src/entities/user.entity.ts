import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetPasswordCode: string;

  @Column('bigint', { nullable: true })
  resetPasswordCodeExpire: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
