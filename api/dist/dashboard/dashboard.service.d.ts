import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';
export type SalesPeriod = 'week' | 'month' | '3months' | 'semester';
export declare class DashboardService {
    private readonly prisma;
    private readonly stockService;
    constructor(prisma: PrismaService, stockService: StockService);
    products(): Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
        };
    } & {
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
    })[]>;
    private periodStart;
    sales(period: SalesPeriod): Promise<{
        period: SalesPeriod;
        from: string;
        mostSold: {
            product: ({
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tags: string[];
                };
            } & {
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
            }) | null;
            quantitySold: number;
            totalRevenue: Prisma.Decimal;
        }[];
        leastSold: {
            product: ({
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tags: string[];
                };
            } & {
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
            }) | null;
            quantitySold: number;
            totalRevenue: Prisma.Decimal;
        }[];
    }>;
    stock(): Promise<{
        critical: {
            status: import("../stock/stock.service").StockStatus;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
            };
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
        }[];
        medium: {
            status: import("../stock/stock.service").StockStatus;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
            };
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
        }[];
        ok: {
            status: import("../stock/stock.service").StockStatus;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string[];
            };
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
        }[];
    }>;
}
