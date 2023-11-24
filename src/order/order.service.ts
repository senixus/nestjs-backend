import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderEmail } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  @InjectRepository(Order) orderRepository: Repository<Order>;
  @InjectRepository(User) userRepository: Repository<User>;
  @InjectRepository(Product) productRepository: Repository<Product>;
  @InjectRepository(Cart) cartRepository: Repository<Cart>;
  @Inject() createOrderEmail: CreateOrderEmail;

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async create(body: CreateOrderDto): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      relations: {
        products: true,
      },
      where: { id: body.cartId },
    });

    const user = await this.userRepository.findOne({
      where: { id: body.userId },
    });

    const order = await this.orderRepository.save({
      products: cart.products,
      totalPrice: cart.code
        ? Math.abs(+cart.totalPriceAfterDiscount)
        : cart.totalPrice,
      user,
      cart,
    });

    await this.cartRepository.save({
      ...cart,
      status: 'completed',
      order,
      user,
    });

    const mail = this.createOrderEmail.configMail(user.email);

    // await this.mailService.createOrder(user.email);

    return order;
  }

  async getById(id: number): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'products')
      .leftJoinAndSelect('order.user', 'user')
      .where({ id })
      .getOne();
  }
}
