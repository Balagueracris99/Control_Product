import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      message: 'Control de Inventarios - API',
      version: '1.0',
      endpoints: {
        auth: { login: 'POST /api/auth/login', register: 'POST /api/auth/register' },
        categories: 'GET/POST/PATCH/DELETE /api/categories',
        products: 'GET/POST/PATCH/DELETE /api/products',
        inventory: 'GET/PATCH /api/inventory/product/:id, POST/GET /api/inventory/movements',
      },
    };
  }
}
