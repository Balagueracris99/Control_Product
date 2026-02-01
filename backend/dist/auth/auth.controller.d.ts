import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
