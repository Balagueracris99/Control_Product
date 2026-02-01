import { Product } from '../products/product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    status: boolean;
    products: Product[];
}
