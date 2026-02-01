import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', default: 0, name: 'current_stock' })
  currentStock: number;

  @Column({ type: 'int', default: 0, name: 'min_stock' })
  minStock: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
