import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(categoryId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        imageUrl: string | null;
        stockQuantity: number;
        criticalLevel: number;
        mediumLevel: number;
    }>;
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
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        imageUrl: string | null;
        stockQuantity: number;
        criticalLevel: number;
        mediumLevel: number;
    }>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
        price: import("@prisma/client/runtime/library").Decimal;
        unit: string;
        imageUrl: string | null;
        stockQuantity: number;
        criticalLevel: number;
        mediumLevel: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
