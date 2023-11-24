import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  @InjectRepository(Category) categoryRepository: Repository<Category>;
  @InjectRepository(Product) productRepository: Repository<Product>;

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: { products: true },
    });
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async getById(id: string): Promise<Category> {
    return await this.categoryRepository.findOneBy({ id: +id });
  }
}
