import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }>;
    findByCpf(cpf: string): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findOrCreate(dto: CreateCustomerDto): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }>;
    create(dto: CreateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
