import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { RootController } from './root.controller';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { Category } from './categories/category.entity';
import { Inventory } from './inventory/inventory.entity';
import { InventoryMovement } from './inventory/inventory-movement.entity';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import databaseConfig from './database/database.config';

@Module({
  controllers: [AppController, RootController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.username', 'postgres'),
        password: configService.get<string>('database.password', 'postgres'),
        database: configService.get<string>('database.database', 'control_product'),
        entities: [User, Category, Product, Inventory, InventoryMovement],
        synchronize: configService.get<boolean>('database.synchronize', true),
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
  ],
})
export class AppModule {}
