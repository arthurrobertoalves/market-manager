import { PaymentMethod } from '@prisma/client';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
export declare class SaleItemInputDto {
    productId: string;
    quantity: number;
}
export declare class CreateSaleDto {
    customer: CreateCustomerDto;
    items: SaleItemInputDto[];
    paymentMethod: PaymentMethod;
}
