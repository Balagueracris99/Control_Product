import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private authService;
    constructor(authService: AuthService);
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }[]>;
    create(dto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
