import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  @Inject() private readonly cartService: CartService;

  @Post()
  async create(@Body() body: CreateCartDto) {
    return await this.cartService.create(body);
  }
}
