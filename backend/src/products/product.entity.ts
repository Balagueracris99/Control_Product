import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (cat) => cat.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'int', default: 0, name: 'current_stock' })
  currentStock: number;

  @Column({ type: 'int', default: 0, name: 'min_stock' })
  minStock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
