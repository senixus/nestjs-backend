import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateUserRoleDto } from './dto/UpdateUserRoleDto';

@Injectable()
export class AdminService {
  @InjectRepository(User) userRepository: Repository<User>;
  @InjectRepository(Product) productRepository: Repository<Product>;
  @InjectRepository(Category) categoryRepository: Repository<Category>;
  @InjectRepository(Order) orderRepository: Repository<Order>;

  async createProduct(
    data: CreateProductDto,
  ): Promise<CreateProductDto & Product> {
    return await this.productRepository.save(data);
  }

  async updateProduct(id: number, body: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

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

  async deleteProduct(id: number): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }
  async createCategory(
    data: CreateCategoryDto,
  ): Promise<CreateCategoryDto & Category> {
    return await this.categoryRepository.save(data);
  }

  async updateCategory(id: number, body: UpdateCategoryDto): Promise<Category> {
    const categoryData = await this.categoryRepository.findOneBy({ id });

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

  async deleteCategory(id: number): Promise<DeleteResult> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('not found');
    }
    return await this.categoryRepository.delete(category.id);
  }
  async updateUserRole(body: UpdateUserRoleDto): Promise<User> {
    return await this.userRepository.save({ ...body });
  }
}
