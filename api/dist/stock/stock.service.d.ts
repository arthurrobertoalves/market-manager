import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type StockStatus = 'CRITICO' | 'MEDIO' | 'OK';
export declare class StockService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStatus(product: Pick<Product, 'stockQuantity' | 'criticalLevel' | 'mediumLevel'>): StockStatus;
    checkStockLevel(product: Product): Promise<{
        id: string;
        message: string;
        productId: string;
        level: import(".prisma/client").$Enums.StockAlertLevel;
        notifiedAt: Date;
        resolved: boolean;
    } | null>;
    findAlerts(resolved?: boolean): import(".prisma/client").Prisma.PrismaPromise<({
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
        message: string;
        productId: string;
        level: import(".prisma/client").$Enums.StockAlertLevel;
        notifiedAt: Date;
        resolved: boolean;
    })[]>;
    resolveAlert(id: string): Promise<{
        id: string;
        message: string;
        productId: string;
        level: import(".prisma/client").$Enums.StockAlertLevel;
        notifiedAt: Date;
        resolved: boolean;
    }>;
}
