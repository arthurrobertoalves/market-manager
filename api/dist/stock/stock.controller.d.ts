import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    findAlerts(resolved?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
