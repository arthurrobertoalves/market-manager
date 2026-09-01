"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const stock_service_1 = require("../stock/stock.service");
let DashboardService = class DashboardService {
    prisma;
    stockService;
    constructor(prisma, stockService) {
        this.prisma = prisma;
        this.stockService = stockService;
    }
    products() {
        return this.prisma.product.findMany({
            include: { category: true },
            orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
        });
    }
    periodStart(period) {
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
                throw new common_1.BadRequestException('Período inválido. Use week, month, 3months ou semester.');
        }
        return start;
    }
    async sales(period) {
        const from = this.periodStart(period);
        const grouped = await this.prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                canceled: false,
                sale: { status: client_1.SaleStatus.FINALIZADA, createdAt: { gte: from } },
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
            totalRevenue: entry._sum.totalPrice ?? new client_1.Prisma.Decimal(0),
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_service_1.StockService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map