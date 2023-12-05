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
import { File } from './file.entity';
import { Order } from './order.entity';
import { Role } from '../enums/role.enum';
import { Exclude } from 'class-transformer';

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

  @Column({ nullable: true })
  @Exclude()
   currentHashedRefreshToken?: string;

  @Column({ default: Role.User })
  role: Role;

  @OneToOne(() => File, (file) => file.profilePhoto)
  @JoinColumn()
  avatar: File;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Discount, (discount) => discount.user)
  discountCodes: Discount[];
}
