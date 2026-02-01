import { Category } from '../categories/category.entity';
export declare class Product {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    category: Category;
    price: number;
    status: boolean;
    currentStock: number;
    minStock: number;
    createdAt: Date;
}
