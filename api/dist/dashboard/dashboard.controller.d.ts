import { DashboardService, SalesPeriod } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    products(): import(".prisma/client").Prisma.PrismaPromise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        imageUrl: string | null;
        stockQuantity: number;
        criticalLevel: number;
        mediumLevel: number;
    })[]>;
    sales(period?: SalesPeriod): Promise<{
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
                price: import("@prisma/client/runtime/library").Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            }) | null;
            quantitySold: number;
            totalRevenue: import("@prisma/client/runtime/library").Decimal;
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
                price: import("@prisma/client/runtime/library").Decimal;
                unit: string;
                imageUrl: string | null;
                stockQuantity: number;
                criticalLevel: number;
                mediumLevel: number;
            }) | null;
            quantitySold: number;
            totalRevenue: import("@prisma/client/runtime/library").Decimal;
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
            price: import("@prisma/client/runtime/library").Decimal;
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
            price: import("@prisma/client/runtime/library").Decimal;
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
            price: import("@prisma/client/runtime/library").Decimal;
            unit: string;
            imageUrl: string | null;
            stockQuantity: number;
            criticalLevel: number;
            mediumLevel: number;
        }[];
    }>;
}
