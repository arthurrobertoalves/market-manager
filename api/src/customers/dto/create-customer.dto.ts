import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(11, 14, { message: 'CPF deve ter entre 11 e 14 caracteres.' })
  cpf!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  contact?: string;
}
