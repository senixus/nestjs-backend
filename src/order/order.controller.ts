import { Controller, Get, Inject, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  @Inject() private readonly orderService: OrderService;

  @Get()
  async getAll() {
    return await this.orderService.getAll();
  }

  @Post('/create')
  async create() {
    return await this.create();
  }
}
