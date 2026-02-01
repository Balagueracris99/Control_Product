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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const inventory_entity_1 = require("../inventory/inventory.entity");
const inventory_movement_entity_1 = require("../inventory/inventory-movement.entity");
let ProductsService = class ProductsService {
    constructor(productRepo, inventoryRepo, movementRepo) {
        this.productRepo = productRepo;
        this.inventoryRepo = inventoryRepo;
        this.movementRepo = movementRepo;
    }
    async findAll() {
        return this.productRepo.find({
            relations: ['category'],
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        return {
            id: product.id,
            name: product.name,
            sku: product.sku,
            categoryId: product.categoryId,
            category: product.category
                ? { id: product.category.id, name: product.category.name }
                : undefined,
            price: Number(product.price),
            status: product.status,
            currentStock: product.currentStock ?? 0,
            minStock: product.minStock ?? 0,
            createdAt: product.createdAt,
        };
    }
    async create(dto) {
        const { currentStock, minStock, ...productData } = dto;
        const product = this.productRepo.create({
            ...productData,
            currentStock: currentStock ?? 0,
            minStock: minStock ?? 0,
        });
        const saved = await this.productRepo.save(product);
        const inventory = this.inventoryRepo.create({
            productId: saved.id,
            currentStock: currentStock ?? 0,
            minStock: minStock ?? 0,
        });
        await this.inventoryRepo.save(inventory);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.productRepo.update(id, dto);
        if (dto.currentStock !== undefined || dto.minStock !== undefined) {
            const inv = await this.inventoryRepo.findOne({ where: { productId: id } });
            if (inv) {
                if (dto.currentStock !== undefined)
                    inv.currentStock = dto.currentStock;
                if (dto.minStock !== undefined)
                    inv.minStock = dto.minStock;
                await this.inventoryRepo.save(inv);
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.movementRepo.delete({ productId: id });
        await this.inventoryRepo.delete({ productId: id });
        await this.productRepo.delete(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_movement_entity_1.InventoryMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map