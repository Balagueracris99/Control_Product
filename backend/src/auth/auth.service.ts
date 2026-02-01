import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    if (!user.status) {
      throw new UnauthorizedException('Usuario inactivo');
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
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

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new UnauthorizedException('El correo ya está registrado');
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

  /** Crear usuario (desde lista de usuarios) */
  async createUser(dto: CreateUserDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new UnauthorizedException('El correo ya está registrado');
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

  /** Listar usuarios (sin password) */
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

  /** Actualizar usuario */
  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (dto.email !== undefined && dto.email !== user.email) {
      const exists = await this.userRepo.findOne({ where: { email: dto.email } });
      if (exists) {
        throw new UnauthorizedException('El correo ya está registrado');
      }
      user.email = dto.email;
    }
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.status !== undefined) user.status = dto.status;
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

  /** Eliminar usuario */
  async deleteUser(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return { deleted: true };
  }
}
