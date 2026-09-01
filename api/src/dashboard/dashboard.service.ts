import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, SaleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';

export type SalesPeriod = 'week' | 'month' | '3months' | 'semester';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockService: StockService,
  ) {}

  products() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  private periodStart(period: SalesPeriod): Date {
    const start = new Date();
    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case '3months':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'semester':
        start.setMonth(start.getMonth() - 6);
        break;
      default:
        throw new BadRequestException('Período inválido. Use week, month, 3months ou semester.');
    }
    return start;
  }

  async sales(period: SalesPeriod) {
    const from = this.periodStart(period);

    const grouped = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        canceled: false,
        sale: { status: SaleStatus.FINALIZADA, createdAt: { gte: from } },
      },
      _sum: { quantity: true, totalPrice: true },
    });

    const productIds = grouped.map((entry) => entry.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    const ranking = grouped
      .map((entry) => ({
        product: productMap.get(entry.productId) ?? null,
        quantitySold: entry._sum.quantity ?? 0,
        totalRevenue: entry._sum.totalPrice ?? new Prisma.Decimal(0),
      }))
      .filter((entry) => entry.product !== null)
      .sort((a, b) => b.quantitySold - a.quantitySold);

    return {
      period,
      from: from.toISOString(),
      mostSold: ranking.slice(0, 10),
      leastSold: [...ranking].reverse().slice(0, 10),
    };
  }

  async stock() {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { stockQuantity: 'asc' },
    });

    const withStatus = products.map((product) => ({
      ...product,
      status: this.stockService.getStatus(product),
    }));

    return {
      critical: withStatus.filter((product) => product.status === 'CRITICO'),
      medium: withStatus.filter((product) => product.status === 'MEDIO'),
      ok: withStatus.filter((product) => product.status === 'OK'),
    };
  }
}
