import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SaleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { StockService } from '../stock/stock.service';
import { CreateSaleDto } from './dto/create-sale.dto';

const SALE_INCLUDE = {
  customer: true,
  user: { select: { id: true, name: true, email: true } },
  items: { include: { product: true } },
} satisfies Prisma.SaleInclude;

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateSaleDto, userId: string) {
    const customer = await this.customersService.findOrCreate(dto.customer);

    const { sale, updatedProducts } = await this.prisma.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
      const itemsData: Prisma.SaleItemCreateWithoutSaleInput[] = [];
      const updatedProducts = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          throw new NotFoundException(`Produto ${item.productId} não encontrado.`);
        }

        const updatedProduct = await this.productsService.decrementStock(
          tx,
          item.productId,
          item.quantity,
        );
        updatedProducts.push(updatedProduct);

        const unitPrice = product.price;
        const totalPrice = unitPrice.times(item.quantity);
        total = total.plus(totalPrice);

        itemsData.push({
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          product: { connect: { id: item.productId } },
        });
      }

      const sale = await tx.sale.create({
        data: {
          customer: { connect: { id: customer.id } },
          user: { connect: { id: userId } },
          total,
          paymentMethod: dto.paymentMethod,
          items: { create: itemsData },
        },
        include: SALE_INCLUDE,
      });

      return { sale, updatedProducts };
    });

    for (const product of updatedProducts) {
      await this.stockService.checkStockLevel(product);
    }

    return sale;
  }

  findAll(params: { from?: Date; to?: Date; status?: SaleStatus }) {
    return this.prisma.sale.findMany({
      where: {
        status: params.status,
        createdAt: {
          gte: params.from,
          lte: params.to,
        },
      },
      include: SALE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id }, include: SALE_INCLUDE });
    if (!sale) {
      throw new NotFoundException('Venda não encontrada.');
    }
    return sale;
  }

  async cancelSale(id: string, reason: string) {
    const sale = await this.findOne(id);

    if (sale.status === SaleStatus.CANCELADA) {
      throw new BadRequestException('Esta venda já está cancelada.');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of sale.items) {
        if (!item.canceled) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }

      await tx.saleItem.updateMany({
        where: { saleId: id, canceled: false },
        data: { canceled: true, cancelReason: reason },
      });

      await tx.sale.update({
        where: { id },
        data: { status: SaleStatus.CANCELADA, cancelReason: reason },
      });
    });

    return this.findOne(id);
  }

  async cancelItem(saleId: string, itemId: string, reason: string) {
    const sale = await this.findOne(saleId);

    if (sale.status === SaleStatus.CANCELADA) {
      throw new BadRequestException('Esta venda já está cancelada.');
    }

    const item = sale.items.find((current) => current.id === itemId);
    if (!item) {
      throw new NotFoundException('Item não encontrado nesta venda.');
    }
    if (item.canceled) {
      throw new BadRequestException('Este item já está cancelado.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } },
      });

      await tx.saleItem.update({
        where: { id: itemId },
        data: { canceled: true, cancelReason: reason },
      });

      await tx.sale.update({
        where: { id: saleId },
        data: { total: { decrement: item.totalPrice } },
      });
    });

    return this.findOne(saleId);
  }

  async closingReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: SaleStatus.FINALIZADA,
      },
      include: SALE_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });

    const totalGeral = sales.reduce((sum, sale) => sum.plus(sale.total), new Prisma.Decimal(0));

    const totalPorFormaPagamento = sales.reduce<Record<string, Prisma.Decimal>>((acc, sale) => {
      const current = acc[sale.paymentMethod] ?? new Prisma.Decimal(0);
      acc[sale.paymentMethod] = current.plus(sale.total);
      return acc;
    }, {});

    return {
      date: startOfDay.toISOString().slice(0, 10),
      totalGeral,
      totalPorFormaPagamento,
      quantidadeVendas: sales.length,
      sales,
    };
  }
}
