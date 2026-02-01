"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const root_controller_1 = require("./root.controller");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const inventory_module_1 = require("./inventory/inventory.module");
const products_module_1 = require("./products/products.module");
const category_entity_1 = require("./categories/category.entity");
const inventory_entity_1 = require("./inventory/inventory.entity");
const inventory_movement_entity_1 = require("./inventory/inventory-movement.entity");
const product_entity_1 = require("./products/product.entity");
const user_entity_1 = require("./users/user.entity");
const database_config_1 = require("./database/database.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController, root_controller_1.RootController],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
                load: [database_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host', 'localhost'),
                    port: configService.get('database.port', 5432),
                    username: configService.get('database.username', 'postgres'),
                    password: configService.get('database.password', 'postgres'),
                    database: configService.get('database.database', 'control_product'),
                    entities: [user_entity_1.User, category_entity_1.Category, product_entity_1.Product, inventory_entity_1.Inventory, inventory_movement_entity_1.InventoryMovement],
                    synchronize: configService.get('database.synchronize', true),
                    logging: process.env.NODE_ENV === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            inventory_module_1.InventoryModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map