import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Inventory } from '../inventory/inventory.entity';
import { InventoryMovement } from '../inventory/inventory-movement.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryMovement)
    private movementRepo: Repository<InventoryMovement>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
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

  async create(dto: CreateProductDto): Promise<Product> {
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
    return this.findOne(saved.id) as Promise<Product>;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    await this.productRepo.update(id, dto);
    if (dto.currentStock !== undefined || dto.minStock !== undefined) {
      const inv = await this.inventoryRepo.findOne({ where: { productId: id } });
      if (inv) {
        if (dto.currentStock !== undefined) inv.currentStock = dto.currentStock;
        if (dto.minStock !== undefined) inv.minStock = dto.minStock;
        await this.inventoryRepo.save(inv);
      }
    }
    return this.findOne(id) as Promise<Product>;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.movementRepo.delete({ productId: id });
    await this.inventoryRepo.delete({ productId: id });
    await this.productRepo.delete(id);
  }
}
