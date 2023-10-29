import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Product } from 'src/entities/product.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(75)
  @MaxLength(150)
  description: string;

  @IsOptional()
  products: Product[];
}
