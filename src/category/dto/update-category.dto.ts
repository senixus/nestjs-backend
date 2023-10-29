import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateCategoryDto {
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

  @IsArray()
  @IsOptional()
  products: number[];
}
