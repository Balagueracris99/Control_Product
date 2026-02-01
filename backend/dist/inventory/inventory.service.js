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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./inventory.entity");
const inventory_movement_entity_1 = require("./inventory-movement.entity");
const product_entity_1 = require("../products/product.entity");
let InventoryService = class InventoryService {
    constructor(inventoryRepo, movementRepo, productRepo) {
        this.inventoryRepo = inventoryRepo;
        this.movementRepo = movementRepo;
        this.productRepo = productRepo;
    }
    async findByProductId(productId) {
        const inv = await this.inventoryRepo.findOne({ where: { productId } });
        if (!inv)
            throw new common_1.NotFoundException('Inventario no encontrado para este producto');
        return inv;
    }
    async findAll() {
        return this.inventoryRepo.find({
            relations: ['product'],
            order: { id: 'ASC' },
        });
    }
    async update(productId, dto) {
        const inv = await this.findByProductId(productId);
        if (dto.currentStock !== undefined)
            inv.currentStock = dto.currentStock;
        if (dto.minStock !== undefined)
            inv.minStock = dto.minStock;
        return this.inventoryRepo.save(inv);
    }
    async createMovement(dto) {
        const userId = dto.userId ?? 1;
        const product = await this.productRepo.findOne({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        let inv = await this.inventoryRepo.findOne({ where: { productId: dto.productId } });
        if (!inv) {
            inv = this.inventoryRepo.create({
                productId: dto.productId,
                currentStock: 0,
                minStock: 0,
            });
            await this.inventoryRepo.save(inv);
        }
        let newStock = inv.currentStock;
        if (dto.type === 'IN')
            newStock += dto.quantity;
        else if (dto.type === 'OUT') {
            if (inv.currentStock < dto.quantity) {
                throw new common_1.BadRequestException('Stock insuficiente');
            }
            newStock -= dto.quantity;
        }
        else if (dto.type === 'ADJUST')
            newStock = dto.quantity;
        if (newStock < 0)
            throw new common_1.BadRequestException('El stock no puede ser negativo');
        inv.currentStock = newStock;
        await this.inventoryRepo.save(inv);
        const movement = this.movementRepo.create({
            productId: dto.productId,
            userId,
            type: dto.type,
            quantity: dto.quantity,
            reason: dto.reason ?? '',
        });
        return this.movementRepo.save(movement);
    }
    async getMovements(productId) {
        const where = productId ? { productId } : {};
        return this.movementRepo.find({
            where,
            relations: ['product', 'user'],
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_movement_entity_1.InventoryMovement)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map