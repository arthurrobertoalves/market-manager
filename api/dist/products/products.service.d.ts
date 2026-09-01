import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId?: string): Prisma.PrismaPromise<({
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
    findOne(id: string): Promise<{
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
    }>;
    findByCode(code: string): Promise<{
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
    }>;
    create(dto: CreateProductDto): Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    decrementStock(tx: Prisma.TransactionClient, productId: string, quantity: number): Promise<{
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
    }>;
}
