import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  @InjectRepository(Product) productRepository: Repository<Product>;

  async getAll() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
    return products;
  }

  async create(body: CreateProductDto) {
    return await this.productRepository.save(body);
  }

  async getById(id: string) {
    return await this.productRepository.findOne({ where: { id: +id } });
  }

  async update(id: string, body: UpdateProductDto) {
    return await this.productRepository.update(id, body);
  }

  async delete(id: string) {
    return await this.productRepository.delete(id);
  }
}
