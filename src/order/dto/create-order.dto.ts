import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  totalPrice: string;

  @IsNotEmpty()
  products: number[];

  @IsNotEmpty()
  @IsNumber()
  user: number;
}
