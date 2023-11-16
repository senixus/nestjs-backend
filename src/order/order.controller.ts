import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  @Inject() private readonly orderService: OrderService;

  @Get()
  async getAll() {
    return await this.orderService.getAll();
  }

  @Post('/create')
  async create(@Body() body: CreateOrderDto) {
    return await this.orderService.create(body);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.orderService.getById(id);
  }
}
