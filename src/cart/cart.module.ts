import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
