import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class RootController {
  @Get()
  getRoot() {
    return {
      message: 'Control de Inventarios - API',
      api: 'http://localhost:3000/api',
      docs: 'Usa /api para los endpoints. Frontend: http://localhost:4200',
    };
  }
}
