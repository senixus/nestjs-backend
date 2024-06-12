import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ToggleDiscountDto } from './dto/toggle-discount.dto';

@Controller('discount')
export class DiscountController {
  @Inject() private readonly discountService: DiscountService;

  @Post()
  async create(@Body() data: { userId: number }) {
    return await this.discountService.create(data.userId);
  }

  @Post('apply')
  async apply(@Body() data: ToggleDiscountDto) {
    return await this.discountService.apply(data);
  }

  @Post('remove')
  async remove(@Body() data: ToggleDiscountDto) {
    return await this.discountService.remove(data);
  }
}
