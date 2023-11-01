import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  totalPrice: string;

  @IsNotEmpty()
  @IsArray()
  products: number[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
