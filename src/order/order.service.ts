import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  @InjectRepository(Order) orderRepository: Repository<Order>;
  @InjectRepository(User) userRepository: Repository<User>;
  @InjectRepository(Product) productRepository: Repository<Product>;

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async create(body: CreateOrderDto): Promise<Order> {
    const user = await this.userRepository.findOne({
      relations: {
        orders: true,
      },
      where: { id: body.userId },
    });

    let products: Product[] = [];

    for (let id of body.products) {
      const product = await this.productRepository.findOne({
        relations: { orders: true },
        where: { id },
      });

      products.push(product);
    }

    const order = await this.orderRepository.save({
      products,
      totalPrice: +body.totalPrice,
      user,
    });
    return order;
  }

  async getById(id: string): Promise<Order> {
    return await this.orderRepository.findOneBy({ id: +id });
  }
}
