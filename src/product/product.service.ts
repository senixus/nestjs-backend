import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  @InjectRepository(Product) productRepository: Repository<Product>;
  @InjectRepository(Category) categoryRepository: Repository<Category>;

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
    return products;
  }

  async getById(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id: +id } });
  }
}
