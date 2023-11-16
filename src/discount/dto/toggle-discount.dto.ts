import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ToggleDiscountDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  cartId: number;
}
