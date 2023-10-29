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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  @Inject() private readonly productService: ProductService;

  @Get()
  async getAll() {
    return await this.productService.getAll();
  }

  @Post('/create')
  async create(@Body() body: CreateProductDto) {
    return await this.productService.create(body);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return await this.productService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
