import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Discount } from './discount.entity';
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

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  resetPasswordCode: string;

  @Column('bigint', { nullable: true })
  resetPasswordCodeExpire: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Discount, (discount) => discount.user)
  discountCodes: Discount[];
}
