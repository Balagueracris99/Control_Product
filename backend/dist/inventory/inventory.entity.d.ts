import { Product } from '../products/product.entity';
export declare class Inventory {
    id: number;
    productId: number;
    product: Product;
    currentStock: number;
    minStock: number;
    updatedAt: Date;
}
