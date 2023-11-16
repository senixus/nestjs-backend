import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
// import { Discount } from './discount.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPriceAfterDiscount: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  rate: number;

  @ManyToMany(() => Product, (product) => product.carts)
  @JoinTable()
  products: Product[];

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  // @OneToOne(() => Discount, (discount) => discount.cart)
  // discount: Discount;
}
