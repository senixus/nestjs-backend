import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column()
  status: string;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
