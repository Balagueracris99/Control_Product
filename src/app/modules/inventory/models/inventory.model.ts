import type { Product } from './product.model';

export interface Inventory {
  id: number;
  productId: number;
  product?: Product;
  currentStock: number;
  minStock: number;
  updatedAt?: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUST';

export interface InventoryMovement {
  id: number;
  productId: number;
  userId: number;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
}
