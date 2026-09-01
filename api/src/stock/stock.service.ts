import { Injectable, Logger } from '@nestjs/common';
import { Product, StockAlertLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type StockStatus = 'CRITICO' | 'MEDIO' | 'OK';

@Injectable()
export class StockService {
  private readonly logger = new Logger('EstoqueAlerta');

  constructor(private readonly prisma: PrismaService) {}

  getStatus(product: Pick<Product, 'stockQuantity' | 'criticalLevel' | 'mediumLevel'>): StockStatus {
    if (product.stockQuantity <= product.criticalLevel) return 'CRITICO';
    if (product.stockQuantity <= product.mediumLevel) return 'MEDIO';
    return 'OK';
  }

  /**
   * Verifica o nível de estoque do produto após uma baixa e, se necessário,
   * registra um StockAlert e simula o aviso automático ao fornecedor e ao
   * gerente (RNF-03), evitando duplicar alertas não resolvidos do mesmo nível.
   */
  async checkStockLevel(product: Product) {
    const status = this.getStatus(product);
    if (status === 'OK') return null;

    const level: StockAlertLevel = status;

    const existingAlert = await this.prisma.stockAlert.findFirst({
      where: { productId: product.id, level, resolved: false },
    });
    if (existingAlert) return existingAlert;

    const message =
      level === 'CRITICO'
        ? `Estoque CRÍTICO: "${product.name}" possui apenas ${product.stockQuantity} unidade(s). Reposição urgente necessária.`
        : `Estoque em nível MÉDIO: "${product.name}" possui ${product.stockQuantity} unidade(s).`;

    const alert = await this.prisma.stockAlert.create({
      data: { productId: product.id, level, message },
    });

    this.logger.warn(
      `[Aviso automático -> fornecedor e gerente] ${message} (produto ${product.id})`,
    );

    return alert;
  }

  findAlerts(resolved?: boolean) {
    return this.prisma.stockAlert.findMany({
      where: resolved === undefined ? undefined : { resolved },
      include: { product: true },
      orderBy: { notifiedAt: 'desc' },
    });
  }

  async resolveAlert(id: string) {
    return this.prisma.stockAlert.update({ where: { id }, data: { resolved: true } });
  }
}
