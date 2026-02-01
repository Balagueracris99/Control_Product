import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<import("./inventory.entity").Inventory[]>;
    findByProduct(productId: number): Promise<import("./inventory.entity").Inventory>;
    update(productId: number, dto: UpdateInventoryDto): Promise<import("./inventory.entity").Inventory>;
    createMovement(dto: CreateMovementDto): Promise<import("./inventory-movement.entity").InventoryMovement>;
    getMovements(productId?: string): Promise<import("./inventory-movement.entity").InventoryMovement[]>;
}
