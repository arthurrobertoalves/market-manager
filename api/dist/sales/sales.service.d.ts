import { Prisma, SaleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { StockService } from '../stock/stock.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private readonly prisma;
    private readonly customersService;
    private readonly productsService;
    private readonly stockService;
    constructor(prisma: PrismaService, customersService: CustomersService, productsService: ProductsService, stockService: StockService);
    create(dto: CreateSaleDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string;
            contact: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                categoryId: string;
                tag: string;
                price: Prisma.Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cancelReason: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    findAll(params: {
        from?: Date;
        to?: Date;
        status?: SaleStatus;
    }): Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string;
            contact: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                categoryId: string;
                tag: string;
                price: Prisma.Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cancelReason: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string;
            contact: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                categoryId: string;
                tag: string;
                price: Prisma.Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cancelReason: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    cancelSale(id: string, reason: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string;
            contact: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                categoryId: string;
                tag: string;
                price: Prisma.Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cancelReason: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    cancelItem(saleId: string, itemId: string, reason: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            cpf: string;
            contact: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                categoryId: string;
                tag: string;
                price: Prisma.Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cancelReason: string | null;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    closingReport(date: Date): Promise<{
        date: string;
        totalGeral: Prisma.Decimal;
        totalPorFormaPagamento: Record<string, Prisma.Decimal>;
        quantidadeVendas: number;
        sales: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
            customer: {
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                cpf: string;
                contact: string | null;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    categoryId: string;
                    tag: string;
                    price: Prisma.Decimal;
                    unit: string;
                    imageUrl: string | null;
                    stockQuantity: number;
                    criticalLevel: number;
                    mediumLevel: number;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                cancelReason: string | null;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
                canceled: boolean;
                saleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            total: Prisma.Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            cancelReason: string | null;
            customerId: string;
            userId: string;
        })[];
    }>;
}
