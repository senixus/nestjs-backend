import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  @Inject() private readonly categoryService: CategoryService;

  @Get()
  async getCategories() {
    return await this.categoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }
}
