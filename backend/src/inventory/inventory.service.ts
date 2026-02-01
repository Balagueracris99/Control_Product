import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { InventoryMovement } from './inventory-movement.entity';
import { Product } from '../products/product.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryMovement)
    private movementRepo: Repository<InventoryMovement>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findByProductId(productId: number): Promise<Inventory> {
    const inv = await this.inventoryRepo.findOne({ where: { productId } });
    if (!inv) throw new NotFoundException('Inventario no encontrado para este producto');
    return inv;
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepo.find({
      relations: ['product'],
      order: { id: 'ASC' },
    });
  }

  async update(productId: number, dto: UpdateInventoryDto): Promise<Inventory> {
    const inv = await this.findByProductId(productId);
    if (dto.currentStock !== undefined) inv.currentStock = dto.currentStock;
    if (dto.minStock !== undefined) inv.minStock = dto.minStock;
    return this.inventoryRepo.save(inv);
  }

  async createMovement(dto: CreateMovementDto): Promise<InventoryMovement> {
    const userId = dto.userId ?? 1;
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');

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
    if (dto.type === 'IN') newStock += dto.quantity;
    else if (dto.type === 'OUT') {
      if (inv.currentStock < dto.quantity) {
        throw new BadRequestException('Stock insuficiente');
      }
      newStock -= dto.quantity;
    } else if (dto.type === 'ADJUST') newStock = dto.quantity;
    if (newStock < 0) throw new BadRequestException('El stock no puede ser negativo');

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

  async getMovements(productId?: number): Promise<InventoryMovement[]> {
    const where = productId ? { productId } : {};
    return this.movementRepo.find({
      where,
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
