import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("./category.entity").Category[]>;
    findOne(id: number): Promise<import("./category.entity").Category>;
    create(dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    update(id: number, dto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    remove(id: number): Promise<void>;
}
