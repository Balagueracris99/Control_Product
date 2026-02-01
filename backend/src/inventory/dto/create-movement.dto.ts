import { IsNumber, IsString, IsIn, Min, IsOptional } from 'class-validator';

export class CreateMovementDto {
  @IsNumber()
  productId: number;

  @IsIn(['IN', 'OUT', 'ADJUST'])
  type: 'IN' | 'OUT' | 'ADJUST';

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
