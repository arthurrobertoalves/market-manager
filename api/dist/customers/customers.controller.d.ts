import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }[]>;
    findByCpf(cpf: string): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateCustomerDto): import(".prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string;
        contact: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
