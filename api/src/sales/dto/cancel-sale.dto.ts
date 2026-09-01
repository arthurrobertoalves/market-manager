import { IsString, MinLength } from 'class-validator';

export class CancelSaleDto {
  @IsString()
  @MinLength(3, { message: 'Informe uma justificativa para o cancelamento.' })
  reason!: string;
}
