import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("./product.entity").Product[]>;
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
    create(dto: CreateProductDto): Promise<import("./product.entity").Product>;
    update(id: number, dto: UpdateProductDto): Promise<import("./product.entity").Product>;
    remove(id: number): Promise<void>;
}
