import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.findByProductId(productId);
  }

  @Patch('product/:productId')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(productId, dto);
  }

  @Post('movements')
  createMovement(@Body() dto: CreateMovementDto) {
    return this.inventoryService.createMovement(dto);
  }

  @Get('movements')
  getMovements(@Query('productId') productId?: string) {
    const id = productId ? parseInt(productId, 10) : undefined;
    return this.inventoryService.getMovements(id);
  }
}
