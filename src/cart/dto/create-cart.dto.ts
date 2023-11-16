import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsArray()
  @IsNotEmpty()
  products: number[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
