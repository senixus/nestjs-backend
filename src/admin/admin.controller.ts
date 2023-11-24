import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/UpdateUserRoleDto';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Inject() private readonly adminService: AdminService;

  @Post('create-product')
  @Roles(Role.Admin)
  async createProduct(@Body() body: CreateProductDto) {
    return await this.adminService.createProduct(body);
  }

  @Put('product/:id')
  @Roles(Role.Admin)
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return await this.adminService.updateProduct(id, body);
  }

  @Delete('product/:id')
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: number) {
    return await this.adminService.deleteProduct(id);
  }

  @Post('create-category')
  @Roles(Role.Admin)
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.adminService.createCategory(body);
  }

  @Put('category/:id')
  @Roles(Role.Admin)
  async updateCategory(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.adminService.updateCategory(id, body);
  }

  @Delete('product/:id')
  @Roles(Role.Admin)
  async deleteCategory(@Param('id') id: number) {
    return await this.adminService.deleteCategory(id);
  }

  @Patch('update-user-role')
  @Roles(Role.Admin)
  async updateUserRole(@Body() body: UpdateUserRoleDto) {
    return await this.adminService.updateUserRole(body);
  }
}
