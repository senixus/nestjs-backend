import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  @InjectRepository(Category) categoryRepository: Repository<Category>;
  @InjectRepository(Product) productRepository: Repository<Product>;

  async getAll() {
    return await this.categoryRepository.find({
      relations: { products: true },
    });
  }

  async create(category: CreateCategoryDto) {
    return await this.categoryRepository.save(category);
  }

  async getById(id: string) {
    return await this.categoryRepository.findOneBy({ id: +id });
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneBy({ id: +id });

    if (category) {
      return await this.categoryRepository.delete(category.id);
    } else {
      throw new NotFoundException('not found');
    }
  }

  async update(id: string, body: UpdateCategoryDto) {
    const categoryData = await this.categoryRepository.findOneBy({ id: +id });

    for (let id of body.products) {
      const productItem = await this.productRepository.findOne({
        relations: { categories: true },
        where: { id },
      });

      productItem.categories = [...productItem.categories, { ...categoryData }];
      await this.productRepository.save(productItem);
    }

    const category = await this.categoryRepository.findOne({
      relations: {
        products: true,
      },
      where: { id: +id },
    });

    category.name = body.name ?? category.name;
    category.description = body.description ?? category.description;

    return await this.categoryRepository.save(category);
  }
}
