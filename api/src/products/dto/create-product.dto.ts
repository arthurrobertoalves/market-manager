import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Matches, Min, MinLength } from 'class-validator';

const CODE_PATTERN = /^[A-Z]{2,5}\d{2,5}$/;
const CODE_MESSAGE =
  'O código deve seguir o padrão prefixo da categoria + número, ex: LAT001 (letras maiúsculas seguidas de números).';

export class CreateProductDto {
  @IsString()
  @Matches(CODE_PATTERN, { message: CODE_MESSAGE })
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsUUID()
  categoryId!: string;

  @IsString()
  tag!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @IsString()
  @MinLength(1)
  unit!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsInt()
  @Min(0)
  criticalLevel!: number;

  @IsInt()
  @Min(0)
  mediumLevel!: number;
}
