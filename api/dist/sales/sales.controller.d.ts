import { SaleStatus } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CancelSaleDto } from './dto/cancel-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(dto: CreateSaleDto, user: AuthenticatedUser): Promise<{
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
                price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    findAll(from?: string, to?: string, status?: SaleStatus): import(".prisma/client").Prisma.PrismaPromise<({
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
                price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    })[]>;
    closingReport(date?: string): Promise<{
        date: string;
        totalGeral: import("@prisma/client/runtime/library").Decimal;
        totalPorFormaPagamento: Record<string, import("@prisma/client/runtime/library").Decimal>;
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
                    price: import("@prisma/client/runtime/library").Decimal;
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
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
                canceled: boolean;
                saleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            total: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            cancelReason: string | null;
            customerId: string;
            userId: string;
        })[];
    }>;
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
                price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    cancelSale(id: string, dto: CancelSaleDto): Promise<{
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
                price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
    cancelItem(id: string, itemId: string, dto: CancelSaleDto): Promise<{
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
                price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            canceled: boolean;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.SaleStatus;
        cancelReason: string | null;
        customerId: string;
        userId: string;
    }>;
}
