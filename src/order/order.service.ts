import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  @InjectRepository(Order) orderRepository: Repository<Order>;
  @InjectRepository(Product)
  productRepository: Repository<Product>;

  async getAll() {
    return await this.orderRepository.find();
  }

  async create(body: CreateOrderDto) {
    // let products = []
    // for(let product of body.products) {
    //     products.push(this.productRepository.findBy({id:product}))
    // }
    // return this.orderRepository.create({...body, products : [...products]});
  }

  async getById(id: string) {
    return await this.orderRepository.findBy({ id: +id });
  }
}
