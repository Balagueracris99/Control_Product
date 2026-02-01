import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
export type MovementType = 'IN' | 'OUT' | 'ADJUST';
export declare class InventoryMovement {
    id: number;
    productId: number;
    product: Product;
    userId: number;
    user: User;
    type: MovementType;
    quantity: number;
    reason: string;
    createdAt: Date;
}
