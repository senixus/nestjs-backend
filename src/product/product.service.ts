import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  @InjectRepository(Product) productRepository: Repository<Product>;
  @InjectRepository(Category) categoryRepository: Repository<Category>;

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
    const product = await this.productRepository.findOneBy({ id: +id });

    for (let id of body.categories) {
      const category = await this.categoryRepository.findOne({
        relations: { products: true },
        where: { id },
      });

      category.products = [...category.products, { ...product }];
      await this.categoryRepository.save(category);
    }

    const productEntity = await this.productRepository.findOne({
      relations: {
        categories: true,
      },
      where: { id: +id },
    });

    productEntity.name = body.name ?? productEntity.name;
    productEntity.description = body.description ?? productEntity.description;
    productEntity.inStock = body.inStock ?? productEntity.inStock;
    productEntity.price = body.price ?? productEntity.price;
    productEntity.quantity = body.quantity ?? productEntity.quantity;

    return await this.productRepository.save(productEntity);
  }

  async delete(id: string) {
    return await this.productRepository.delete(id);
  }
}
