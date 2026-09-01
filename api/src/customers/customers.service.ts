import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }
    return customer;
  }

  findByCpf(cpf: string) {
    return this.prisma.customer.findUnique({ where: { cpf } });
  }

  async findOrCreate(dto: CreateCustomerDto) {
    const existing = await this.findByCpf(dto.cpf);
    if (existing) {
      return this.prisma.customer.update({
        where: { cpf: dto.cpf },
        data: { name: dto.name, contact: dto.contact },
      });
    }
    return this.prisma.customer.create({ data: dto });
  }

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }
}
