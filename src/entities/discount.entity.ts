import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
// import { Cart } from './cart.entity';
import { User } from './user.entity';

@Entity('discount')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  rate: number;

  @Column({ default: 'active' })
  status: string;

  @Column('bigint', { nullable: true })
  expiredAt: number;

  @ManyToOne(() => User, (user) => user.discountCodes)
  user: User;

  // @OneToOne(() => Cart, (cart) => cart.discount)
  // cart: Cart;
}
