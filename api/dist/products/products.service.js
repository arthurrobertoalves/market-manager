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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(categoryId) {
        return this.prisma.product.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { category: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado.');
        }
        return product;
    }
    async findByCode(code) {
        const product = await this.prisma.product.findUnique({
            where: { code },
            include: { category: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Nenhum produto encontrado com o código "${code}".`);
        }
        return product;
    }
    create(dto) {
        return this.prisma.product.create({ data: dto, include: { category: true } });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({ where: { id }, data: dto, include: { category: true } });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({ where: { id } });
        return { success: true };
    }
    async decrementStock(tx, productId, quantity) {
        const result = await tx.product.updateMany({
            where: { id: productId, stockQuantity: { gte: quantity } },
            data: { stockQuantity: { decrement: quantity } },
        });
        if (result.count === 0) {
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new common_1.NotFoundException('Produto não encontrado.');
            }
            throw new common_1.BadRequestException(`Estoque insuficiente para "${product.name}". Disponível: ${product.stockQuantity}.`);
        }
        return tx.product.findUniqueOrThrow({ where: { id: productId } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map