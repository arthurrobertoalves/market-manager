import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Matches, Min, MinLength } from 'class-validator';

const CODE_PATTERN = /^[A-Z]{2,5}\d{2,5}$/;
const CODE_MESSAGE =
  'O código deve seguir o padrão prefixo da categoria + número, ex: LAT001 (letras maiúsculas seguidas de números).';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Matches(CODE_PATTERN, { message: CODE_MESSAGE })
  code?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  unit?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  criticalLevel?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  mediumLevel?: number;
}
