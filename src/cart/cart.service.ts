import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  @InjectRepository(Cart) cartRepository: Repository<Cart>;
  @InjectRepository(Product) productRepository: Repository<Product>;
  @InjectRepository(User) userRepository: Repository<User>;

  async create(data: CreateCartDto): Promise<Cart> {
    let products: Product[] = [];

    for (let item of data.products) {
      const product = await this.productRepository.findOneBy({ id: item });

      if (product) {
        products.push(product);
      }
    }

    const totalPrice = products.reduce((prev, curr) => prev + curr.price, 0);
    const user = await this.userRepository.findOneBy({ id: data.userId });
    return await this.cartRepository.save({
      products,
      totalPrice,
      user,
    });
  }
}
