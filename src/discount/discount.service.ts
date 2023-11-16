import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Discount } from 'src/entities/discount.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ToggleDiscountDto } from './dto/toggle-discount.dto';

@Injectable()
export class DiscountService {
  @InjectRepository(Discount) discountRepository: Repository<Discount>;
  @InjectRepository(User) userRepository: Repository<User>;
  @InjectRepository(Cart) cartRepository: Repository<Cart>;

  async create(userId: number): Promise<Discount> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('There is no user');
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const rate = 10 * Math.floor(Math.random() * 11);

    return await this.discountRepository.save({
      code: `${code}`,
      rate: rate === 0 ? 10 : rate,
      user,
      expiredAt: Date.now() + 3600 * 1000,
    });
  }

  async apply(data: ToggleDiscountDto): Promise<Cart> {
    const cart = await this.cartRepository.findOneBy({ id: data.cartId });

    if (cart) {
      const discount = await this.discountRepository.findOneBy({
        code: data.code,
      });

      if (!discount) throw new NotFoundException('There is no discount code');

      if (discount.expiredAt < Date.now()) {
        await this.discountRepository.save({ ...discount, status: 'expired' });
        throw new BadRequestException('Discount code is expired!');
      }

      if (discount.status === 'used')
        throw new BadRequestException('Discount code is already used!');

      const totalPriceAfterDiscount =
        cart.totalPrice - (cart.totalPrice * +discount.code) / 100;

      await this.discountRepository.save({ ...discount, status: 'used' });

      return await this.cartRepository.save({
        ...cart,
        totalPriceAfterDiscount,
        code: discount.code,
        rate: discount.rate,
      });
    }
  }

  async remove(data: ToggleDiscountDto): Promise<Cart> {
    const cart = await this.cartRepository.findOneBy({ id: data.cartId });

    if (cart && cart.code) {
      const discount = await this.discountRepository.findOneBy({
        code: data.code,
      });

      if (!discount) throw new NotFoundException('There is no discount code');

      if (discount.status === 'used') {
        await this.discountRepository.save({
          ...discount,
          status: discount.expiredAt < Date.now() ? 'expired' : 'active',
        });

        return await this.cartRepository.save({
          ...cart,
          totalPriceAfterDiscount: 0.0,
          code: null,
          rate: null,
        });
      }
    }
  }
}
