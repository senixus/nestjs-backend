import { UserService } from './user.service';
import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  @Inject() private readonly userService: UserService;

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(id, body);
  }
}
