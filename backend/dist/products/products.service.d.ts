import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Inventory } from '../inventory/inventory.entity';
import { InventoryMovement } from '../inventory/inventory-movement.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productRepo;
    private inventoryRepo;
    private movementRepo;
    constructor(productRepo: Repository<Product>, inventoryRepo: Repository<Inventory>, movementRepo: Repository<InventoryMovement>);
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        sku: string;
        categoryId: number;
        category: {
            id: number;
            name: string;
        } | undefined;
        price: number;
        status: boolean;
        currentStock: number;
        minStock: number;
        createdAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
