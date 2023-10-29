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

  @Post('/create')
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return await this.categoryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
