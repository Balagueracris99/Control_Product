"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async validateUser(email, password) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        if (!user.status) {
            throw new common_1.UnauthorizedException('Usuario inactivo');
        }
        return user;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                created_at: user.createdAt,
            },
        };
    }
    async register(dto) {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.UnauthorizedException('El correo ya está registrado');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            name: dto.name ?? '',
            email: dto.email,
            password: hashed,
            role: 'USER',
            status: true,
        });
        await this.userRepo.save(user);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                created_at: user.createdAt,
            },
        };
    }
    async createUser(dto) {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.UnauthorizedException('El correo ya está registrado');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashed,
            role: dto.role ?? 'USER',
            status: true,
        });
        await this.userRepo.save(user);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            created_at: user.createdAt,
        };
    }
    async findAllUsers() {
        const users = await this.userRepo.find({
            order: { id: 'ASC' },
            select: ['id', 'name', 'email', 'role', 'status', 'createdAt'],
        });
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            created_at: u.createdAt,
        }));
    }
    async updateUser(id, dto) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (dto.email !== undefined && dto.email !== user.email) {
            const exists = await this.userRepo.findOne({ where: { email: dto.email } });
            if (exists) {
                throw new common_1.UnauthorizedException('El correo ya está registrado');
            }
            user.email = dto.email;
        }
        if (dto.name !== undefined)
            user.name = dto.name;
        if (dto.role !== undefined)
            user.role = dto.role;
        if (dto.status !== undefined)
            user.status = dto.status;
        if (dto.password !== undefined && dto.password.length >= 6) {
            user.password = await bcrypt.hash(dto.password, 10);
        }
        await this.userRepo.save(user);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            created_at: user.createdAt,
        };
    }
    async deleteUser(id) {
        const result = await this.userRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        return { deleted: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map