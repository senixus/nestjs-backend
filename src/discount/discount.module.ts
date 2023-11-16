import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Discount } from 'src/entities/discount.entity';
import { User } from 'src/entities/user.entity';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, User, Cart])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
