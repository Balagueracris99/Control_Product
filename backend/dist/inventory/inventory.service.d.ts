import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { InventoryMovement } from './inventory-movement.entity';
import { Product } from '../products/product.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
export declare class InventoryService {
    private inventoryRepo;
    private movementRepo;
    private productRepo;
    constructor(inventoryRepo: Repository<Inventory>, movementRepo: Repository<InventoryMovement>, productRepo: Repository<Product>);
    findByProductId(productId: number): Promise<Inventory>;
    findAll(): Promise<Inventory[]>;
    update(productId: number, dto: UpdateInventoryDto): Promise<Inventory>;
    createMovement(dto: CreateMovementDto): Promise<InventoryMovement>;
    getMovements(productId?: number): Promise<InventoryMovement[]>;
}
