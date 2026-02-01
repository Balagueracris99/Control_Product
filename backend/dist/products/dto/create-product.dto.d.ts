export declare class CreateProductDto {
    name: string;
    sku: string;
    categoryId: number;
    price: number;
    status?: boolean;
    currentStock?: number;
    minStock?: number;
}
