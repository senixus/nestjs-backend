import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderEmail } from 'src/mail/mail.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, Cart])],
  controllers: [OrderController],
  providers: [OrderService, CreateOrderEmail],
})
export class OrderModule {}
