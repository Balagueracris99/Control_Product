import type { Category } from './category.model';

export interface Product {
  id?: number;
  name: string;
  sku: string;
  categoryId: number;
  category?: Category;
  price: number;
  status: boolean;
  /** Stock actual (persistido en BD: products.current_stock e inventory.current_stock) */
  currentStock?: number;
  /** Stock mínimo para alertas (persistido en BD: products.min_stock e inventory.min_stock) */
  minStock?: number;
  createdAt?: string;
}
