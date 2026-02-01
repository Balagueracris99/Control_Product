import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    validateUser(email: string, password: string): Promise<User | null>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            status: boolean;
            created_at: Date;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            status: boolean;
            created_at: Date;
        };
    }>;
    createUser(dto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }>;
    findAllUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }[]>;
    updateUser(id: number, dto: UpdateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
        created_at: Date;
    }>;
    deleteUser(id: number): Promise<{
        deleted: boolean;
    }>;
}
