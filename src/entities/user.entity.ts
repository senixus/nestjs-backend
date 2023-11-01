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

  @Column({ nullable: true })
  resetPasswordCodeExpire: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
