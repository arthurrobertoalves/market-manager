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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const customers_service_1 = require("../customers/customers.service");
const products_service_1 = require("../products/products.service");
const stock_service_1 = require("../stock/stock.service");
const SALE_INCLUDE = {
    customer: true,
    user: { select: { id: true, name: true, email: true } },
    items: { include: { product: true } },
};
let SalesService = class SalesService {
    prisma;
    customersService;
    productsService;
    stockService;
    constructor(prisma, customersService, productsService, stockService) {
        this.prisma = prisma;
        this.customersService = customersService;
        this.productsService = productsService;
        this.stockService = stockService;
    }
    async create(dto, userId) {
        const customer = await this.customersService.findOrCreate(dto.customer);
        const { sale, updatedProducts } = await this.prisma.$transaction(async (tx) => {
            let total = new client_1.Prisma.Decimal(0);
            const itemsData = [];
            const updatedProducts = [];
            for (const item of dto.items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) {
                    throw new common_1.NotFoundException(`Produto ${item.productId} não encontrado.`);
                }
                const updatedProduct = await this.productsService.decrementStock(tx, item.productId, item.quantity);
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
    findAll(params) {
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
    async findOne(id) {
        const sale = await this.prisma.sale.findUnique({ where: { id }, include: SALE_INCLUDE });
        if (!sale) {
            throw new common_1.NotFoundException('Venda não encontrada.');
        }
        return sale;
    }
    async cancelSale(id, reason) {
        const sale = await this.findOne(id);
        if (sale.status === client_1.SaleStatus.CANCELADA) {
            throw new common_1.BadRequestException('Esta venda já está cancelada.');
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
                data: { status: client_1.SaleStatus.CANCELADA, cancelReason: reason },
            });
        });
        return this.findOne(id);
    }
    async cancelItem(saleId, itemId, reason) {
        const sale = await this.findOne(saleId);
        if (sale.status === client_1.SaleStatus.CANCELADA) {
            throw new common_1.BadRequestException('Esta venda já está cancelada.');
        }
        const item = sale.items.find((current) => current.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException('Item não encontrado nesta venda.');
        }
        if (item.canceled) {
            throw new common_1.BadRequestException('Este item já está cancelado.');
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
    async closingReport(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: { gte: startOfDay, lte: endOfDay },
                status: client_1.SaleStatus.FINALIZADA,
            },
            include: SALE_INCLUDE,
            orderBy: { createdAt: 'asc' },
        });
        const totalGeral = sales.reduce((sum, sale) => sum.plus(sale.total), new client_1.Prisma.Decimal(0));
        const totalPorFormaPagamento = sales.reduce((acc, sale) => {
            const current = acc[sale.paymentMethod] ?? new client_1.Prisma.Decimal(0);
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
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        customers_service_1.CustomersService,
        products_service_1.ProductsService,
        stock_service_1.StockService])
], SalesService);
//# sourceMappingURL=sales.service.js.map